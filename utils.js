// utils.js
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export function formatRelativeTime(dateString) {
  if (!dateString) return "";
  return formatDistanceToNow(new Date(dateString), {
    addSuffix: true,
    locale: id,
  });
}
