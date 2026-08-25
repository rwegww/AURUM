const parseUrl = (url) => {
  if (!url || typeof url !== 'string') return null;

  try {
    return new URL(url);
  } catch {
    try {
      return new URL(`https://${url}`);
    } catch {
      return null;
    }
  }
};

const normalizeHostname = (hostname) => hostname
  .replace(/^www\./, '')
  .replace(/^m\./, '');

const isHostname = (hostname, domain) => hostname === domain || hostname.endsWith(`.${domain}`);

const getYouTubeId = (parsedUrl) => {
  if (!parsedUrl) return '';

  const hostname = normalizeHostname(parsedUrl.hostname);
  const segments = parsedUrl.pathname.split('/').filter(Boolean);

  if (hostname === 'youtu.be') return segments[0] || '';
  if (!isHostname(hostname, 'youtube.com') && !isHostname(hostname, 'youtube-nocookie.com')) return '';

  if (parsedUrl.pathname === '/watch') return parsedUrl.searchParams.get('v') || '';
  if (['embed', 'shorts', 'live'].includes(segments[0])) return segments[1] || '';

  return '';
};

const getVimeoId = (parsedUrl) => {
  if (!parsedUrl) return '';

  const hostname = normalizeHostname(parsedUrl.hostname);
  if (!isHostname(hostname, 'vimeo.com')) return '';

  const segments = parsedUrl.pathname.split('/').filter(Boolean);
  if (hostname === 'player.vimeo.com' && segments[0] === 'video') return segments[1] || '';

  return segments.find((segment) => /^\d+$/.test(segment)) || '';
};

const parseYouTubeTime = (value) => {
  if (!value) return 0;
  if (/^\d+$/.test(value)) return Number(value);

  const match = value.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/i);
  if (!match) return 0;

  const [, hours = 0, minutes = 0, seconds = 0] = match;
  return (Number(hours) * 3600) + (Number(minutes) * 60) + Number(seconds);
};

export const isFileVideo = (url = '') => {
  const parsedUrl = parseUrl(url);
  const pathname = parsedUrl?.pathname || url;
  return /\.(mp4|webm|ogg)$/i.test(pathname);
};

export const normalizeHttpUrl = (url = '') => {
  const value = typeof url === 'string' ? url.trim() : '';
  if (!value) return '';

  const parsedUrl = parseUrl(value);
  if (!parsedUrl || !['http:', 'https:'].includes(parsedUrl.protocol)) return '';
  return parsedUrl.href;
};

export const isValidHttpUrl = (url = '') => Boolean(normalizeHttpUrl(url));

export const isCloudinaryVideoUrl = (url = '') => {
  const normalizedUrl = normalizeHttpUrl(url);
  if (!normalizedUrl) return false;

  const parsedUrl = new URL(normalizedUrl);
  return parsedUrl.protocol === 'https:'
    && parsedUrl.hostname.toLowerCase() === 'res.cloudinary.com'
    && /\/video\/upload\//i.test(parsedUrl.pathname);
};

export const isExternalEmbedVideo = (url = '') => {
  const provider = getVideoProvider(url);
  return provider === 'youtube' || provider === 'vimeo';
};

export const getVideoProvider = (url = '') => {
  const parsedUrl = parseUrl(url);
  if (!parsedUrl) return 'file';

  const hostname = normalizeHostname(parsedUrl.hostname);
  if (hostname === 'youtu.be'
    || isHostname(hostname, 'youtube.com')
    || isHostname(hostname, 'youtube-nocookie.com')) return 'youtube';
  if (isHostname(hostname, 'vimeo.com')) return 'vimeo';
  return 'file';
};

export const getYouTubeVideoId = (url = '') => getYouTubeId(parseUrl(url));

export const getYouTubeStartTime = (url = '') => {
  const parsedUrl = parseUrl(url);
  if (!parsedUrl) return 0;
  return parseYouTubeTime(parsedUrl.searchParams.get('start') || parsedUrl.searchParams.get('t'));
};

export const getVideoEmbedUrl = (url = '') => {
  const parsedUrl = parseUrl(url);
  if (!parsedUrl) return url;

  const youtubeId = getYouTubeId(parsedUrl);
  if (youtubeId) {
    const start = getYouTubeStartTime(url);
    const query = start ? `?start=${start}` : '';
    return `https://www.youtube.com/embed/${youtubeId}${query}`;
  }

  const vimeoId = getVimeoId(parsedUrl);
  if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}`;

  return url;
};
