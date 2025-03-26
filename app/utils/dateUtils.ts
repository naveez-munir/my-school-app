export function formatDate(dateString?: string | Date | null, fallback: string = 'N/A'): string {
  if (!dateString) return fallback;
  
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (error) {
    console.error('Invalid date format:', error);
    return fallback;
  }
}

export function formatDateTime(dateString?: string | Date | null, fallback: string = 'N/A'): string {
  if (!dateString) return fallback;
  
  try {
    return new Date(dateString).toLocaleString();
  } catch (error) {
    console.error('Invalid date format:', error);
    return fallback;
  }
}

export function getRelativeDate(dateString?: string | Date | null, fallback: string = 'N/A'): string {
  if (!dateString) return fallback;
  
  try {
    const date = new Date(dateString);
    const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    
    const now = new Date();
    const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);
 
    if (Math.abs(diffInSeconds) < 60) {
      return formatter.format(diffInSeconds, 'second');
    } else if (Math.abs(diffInSeconds) < 3600) {
      return formatter.format(Math.floor(diffInSeconds / 60), 'minute');
    } else if (Math.abs(diffInSeconds) < 86400) {
      return formatter.format(Math.floor(diffInSeconds / 3600), 'hour');
    } else if (Math.abs(diffInSeconds) < 2592000) {
      return formatter.format(Math.floor(diffInSeconds / 86400), 'day');
    } else if (Math.abs(diffInSeconds) < 31536000) {
      return formatter.format(Math.floor(diffInSeconds / 2592000), 'month');
    } else {
      return formatter.format(Math.floor(diffInSeconds / 31536000), 'year');
    }
  } catch (error) {
    console.error('Invalid date format:', error);
    return fallback;
  }
}
