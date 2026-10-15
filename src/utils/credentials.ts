import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import type { Credentials, CookieData } from '../types/pingcode.js';

const CREDENTIALS_DIR = path.join(os.homedir(), '.pingcode-mcp');
const CREDENTIALS_FILE = path.join(CREDENTIALS_DIR, 'credentials.json');

/**
 * 判断 cookie 域名是否属于指定站点
 * 兼容 pingcode.cairenhui.com 这类自定义域名：cookie 可能挂在 .cairenhui.com 上
 * @param cookieDomain cookie 的 domain 字段
 * @param siteDomain PingCode 站点域名，如 pingcode.cairenhui.com
 */
export function isSiteCookie(cookieDomain: string, siteDomain: string): boolean {
  const cookieHost = cookieDomain.replace(/^\./, '').toLowerCase();
  const siteHost = siteDomain.replace(/^\./, '').toLowerCase();
  if (!cookieHost || !siteHost) return false;

  // 取后两段作为主域名，如 pingcode.cairenhui.com -> cairenhui.com
  const rootHost = siteHost.split('.').slice(-2).join('.');

  return (
    cookieHost === siteHost ||
    cookieHost.endsWith(`.${siteHost}`) ||
    cookieHost === rootHost ||
    cookieHost.endsWith(`.${rootHost}`)
  );
}

/**
 * 确保凭证目录存在
 */
function ensureCredentialsDir(): void {
  if (!fs.existsSync(CREDENTIALS_DIR)) {
    fs.mkdirSync(CREDENTIALS_DIR, { recursive: true, mode: 0o700 });
  }
}

/**
 * 保存凭证
 */
export function saveCredentials(credentials: Credentials): void {
  ensureCredentialsDir();
  fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(credentials, null, 2), {
    mode: 0o600,
  });
}

/**
 * 读取凭证
 */
export function loadCredentials(): Credentials | null {
  try {
    if (!fs.existsSync(CREDENTIALS_FILE)) {
      return null;
    }
    const content = fs.readFileSync(CREDENTIALS_FILE, 'utf-8');
    return JSON.parse(content) as Credentials;
  } catch {
    return null;
  }
}

/**
 * 删除凭证
 */
export function clearCredentials(): void {
  try {
    if (fs.existsSync(CREDENTIALS_FILE)) {
      fs.unlinkSync(CREDENTIALS_FILE);
    }
  } catch {
    // ignore
  }
}

/**
 * 检查凭证是否有效（未过期）
 */
export function isCredentialsValid(credentials: Credentials | null): boolean {
  if (!credentials) return false;
  if (!credentials.cookies || credentials.cookies.length === 0) return false;

  // 按域名判断 cookie 是否属于本站点
  // 注意：PingCode 自建域名的会话 cookie 名为 s-<teamId>，靠名字猜（session/token）会误判
  const siteDomain =
    credentials.domain || process.env.PINGCODE_DOMAIN || 'neuralgalaxy.pingcode.com';
  const hasSiteCookie = credentials.cookies.some((c) => isSiteCookie(c.domain, siteDomain));

  if (!hasSiteCookie) return false;

  // 检查过期时间（如果有设置）
  if (credentials.expires_at && Date.now() > credentials.expires_at) {
    return false;
  }

  return true;
}

/**
 * 将 cookies 转换为请求头格式
 */
export function cookiesToHeader(cookies: CookieData[]): string {
  return cookies.map((c) => `${c.name}=${c.value}`).join('; ');
}

/**
 * 获取凭证存储路径（用于提示用户）
 */
export function getCredentialsPath(): string {
  return CREDENTIALS_FILE;
}
