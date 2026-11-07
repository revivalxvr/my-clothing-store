import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_USER_SERVICE_URL,
  withCredentials: true, // WAJIB agar cookie (access & refresh token) ikut terkirim otomatis
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response Interceptor untuk menangani otomatisasi Refresh Token
api.interceptors.response.use(
  (response) => {
    // Jika respons normal/sukses, langsung teruskan
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Cek jika error bernilai 401 (Unauthorized) dan request belum pernah dicoba ulang (_retry)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Tandai agar tidak terjadi infinite loop (perulangan tak terbatas)

      try {
        // 1. Panggil endpoint refresh token backend
        // Karena withCredentials: true, cookie "refresh_token" otomatis dikirim ke backend
        await api.patch('/auth/refresh-token');

        // 2. Jika berhasil, backend sudah memasang cookie "access_token" yang baru di browser
        // 3. Ulangi kembali request awal yang tadinya gagal
        return api(originalRequest);
      } catch (refreshError) {
        // Jika refresh token di backend ternyata juga sudah kedaluwarsa / tidak valid:
        console.error('Session expired, please login again.');
        
        // Hapus session pendaftaran jika ada, lalu arahkan user kembali ke halaman login
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('pending_registration_email');
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);