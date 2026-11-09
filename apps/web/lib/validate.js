export const validateEmail = (v) =>
  !v || !v.trim()
    ? "Isi emailmu."
    : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
    ? ""
    : "Format email belum benar.";

export const validatePassword = (v) =>
  !v ? "Isi passwordmu." : v.length < 8 ? "Minimal 8 karakter." : "";

export const validateUsername = (v) =>
  !v || !v.trim()
    ? "Isi username."
    : v.trim().length < 3
    ? "Minimal 3 karakter."
    : /^\w+$/.test(v.trim())
    ? ""
    : "Hanya huruf, angka, dan garis bawah.";

// 0 = kosong, 1 = Lemah ... 4 = Kuat
export function passwordScore(v) {
  if (!v) return 0;
  let s = 0;
  if (v.length >= 8) s++;
  if (v.length >= 12) s++;
  if (/[a-z]/i.test(v) && /\d/.test(v)) s++;
  if ((/[a-z]/.test(v) && /[A-Z]/.test(v)) || /[^a-zA-Z0-9]/.test(v)) s++;
  return Math.max(s, 1);
}

