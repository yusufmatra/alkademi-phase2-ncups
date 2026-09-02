# Sesi 9 - Perbandingan Base Model dan RAG

- **Base model:** pertanyaan dikirim langsung ke model tanpa Knowledge Base.
- **RAG:** pertanyaan dikirim melalui Knowledge Base KelanaAI. Sistem mencari isi dokumen terlebih dahulu sebelum membuat jawaban.

Pertanyaan harus sama persis pada kedua pengujian. Perbedaannya hanya Knowledge Base digunakan atau tidak.

## Tabel Perbandingan

| No. | Pertanyaan | Jawaban base model | Jawaban RAG / bukti dari dokumen | Source RAG | Peningkatan |
|---|---|---|---|---|---|
| 1 | What documents are required to visit Japan? | To visit Japan, the base model recommends a valid passport, visa if required, accommodation confirmation, return or onward ticket, proof of funds, travel insurance, and checking current embassy requirements. | To visit Japan, the primary document found by RAG is an invitation letter. It also mentions the applicant name, planned activities, recent and valid documents, accepted copies, and possible additional documents. | `single-entry-short-term-visa-japan.pdf` | RAG lebih grounded, tetapi jawabannya hanya berdasarkan chunk yang ditemukan. |
| 2 | Do Indonesian passport holders need a visa to visit Japan? | The base model says Indonesian passport holders may enter Japan visa-free for short stays of up to 15 days, but recommends checking the latest official policy. | I cannot find the answer in the uploaded knowledge base regarding whether Indonesian passport holders need a visa to visit Japan. | `single-entry-short-term-visa-japan.pdf` | Base model lebih menjawab pertanyaan, tetapi informasi harus diverifikasi karena kebijakan visa dapat berubah. |
| 3 | What are the top attractions to visit in Tokyo? | The base model lists many general attractions, including Senso-ji, Shibuya Crossing, Tokyo Skytree, Meiji Shrine, Imperial Palace, Akihabara, Harajuku, Ueno Park, and Tokyo Tower. | RAG lists Shibuya Crossing and Shibuya Sky, Senso-ji Temple, Meiji Shrine and Harajuku, Akihabara, teamLab Planets, Tokyo Skytree, and Tokyo Tower. | `Tokyo_Travel_Guide_EN.md` | RAG lebih singkat dan memiliki source yang jelas. |
| 4 | What should I pack for a trip to Japan? | The base model recommends clothing, comfortable shoes, rain protection, documents, electronics, toiletries, medication, local currency, and a credit card. | RAG mentions a travel pillow, MP3 player, earplugs, eye mask, smartphone, camera, laptop or tablet, power adapters, money, wallet, medication, hand sanitizer, and a Japanese dictionary. | `Japan-Packing-List.pdf` | RAG memberikan daftar yang lebih terhubung dengan dokumen, sedangkan base model memberi kategori umum. |
| 5 | What does the travel insurance cover? | The base model lists trip cancellation, baggage loss or delay, medical expenses, emergency evacuation, flight delay, personal liability, natural disasters, and personal accident coverage. | I cannot find the answer in the uploaded knowledge base. The retrieved source is `Japan-Packing-List.pdf`, sehingga hasilnya tidak relevan dengan pertanyaan. | `Japan-Packing-List.pdf` | Base model lebih relevan. Ini contoh kegagalan retrieval, bukan peningkatan RAG. |

## Kriteria Penilaian

Untuk setiap pertanyaan, bandingkan kedua jawaban berdasarkan hal-hal berikut:

- **Relevance:** Apakah jawaban menjawab pertanyaan secara langsung?
- **Specificity:** Apakah jawaban memberikan detail yang jelas, bukan hanya jawaban umum?
- **Grounding:** Apakah detail jawaban dapat ditemukan di dokumen yang diambil?
- **Citation:** Apakah jawaban RAG menampilkan dokumen sumber?
- **Accuracy:** Apakah informasinya benar dan masih sesuai?

Saya menggunakan nilai sederhana dari 1 sampai 5 untuk setiap jawaban:

| Pertanyaan | Relevance base | Relevance RAG | Specificity base | Specificity RAG | Citation RAG | Catatan |
|---|---:|---:|---:|---:|---|---|
| 1 | 4 | 4 | 4 | 4 | Yes | RAG memiliki source, tetapi hanya menjelaskan dokumen yang berhasil diambil. |
| 2 | 4 | 1 | 3 | 1 | Yes | RAG tidak menemukan jawaban. Base model juga perlu dicek ke sumber resmi. |
| 3 | 5 | 5 | 4 | 4 | Yes | Keduanya relevan; RAG lebih mudah diverifikasi. |
| 4 | 4 | 4 | 4 | 4 | Yes | RAG sesuai isi packing list, base model lebih umum. |
| 5 | 5 | 1 | 4 | 1 | Yes | RAG mengambil dokumen yang salah. |


## Template Kesimpulan

> Base model memberikan jawaban umum tanpa citation dokumen. Sistem RAG memberikan jawaban berdasarkan dokumen travel yang berhasil diambil dan menampilkan source. RAG lebih berguna ketika dokumen yang relevan berhasil ditemukan. Pada pertanyaan nomor 5, hasilnya belum relevan karena source yang diambil berasal dari Japan Packing List. Oleh karena itu, hasil tersebut tidak dihitung sebagai peningkatan.

## File Bukti

- `experiments/RAG/response_1788278315937.json`
- `experiments/RAG/response_1788278384395.json`
- `experiments/RAG/response_1788278418872.json`
- `experiments/RAG/response_1788278439103.json`
- `experiments/RAG/response_1788278456755.json`
