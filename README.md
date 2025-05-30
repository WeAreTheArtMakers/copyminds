# Copymind Backend

Bu belge, Copymind projesinin backend bileşeninin kurulumunu, yapılandırılmasını ve kullanımını açıklar.

## İçindekiler
1. [Genel Bakış](#genel-bakış)
2. [Özellikler](#özellikler)
3. [Önkoşullar](#önkoşullar)
4. [Kurulum](#kurulum)
   - [Depoyu Klonlama](#depoyu-klonlama)
   - [Bağımlılıkların Yüklenmesi](#bağımlılıkların-yüklenmesi)
   - [Çevresel Değişkenler](#çevresel-değişkenler)
5. [Veritabanı Yapılandırması](#veritabanı-yapılandırması)
6. [Çalıştırma](#çalıştırma)
7. [API Dokümantasyonu](#api-dokümantasyonu)
   - [Temel Endpoints](#temel-endpoints)
8. [Testler](#testler)
9. [CI/CD ve Dağıtım](#cicd-ve-dağıtım)
10. [Katkıda Bulunanlar](#katkıda-bulunanlar)
11. [Lisans](#lisans)

## Genel Bakış
Copymind backend, kullanıcıların metin ve yapay zeka destekli içerik eşleştirme isteklerini işleyen RESTful bir servistir. Express.js tabanlıdır ve PostgreSQL veritabanı ile çalışır.

## Özellikler
- RESTful API endpontları
- JWT tabanlı kimlik doğrulama
- CRUD işlemleri
- Hata yönetimi ve loglama
- Ortam bazlı yapılandırma

## Önkoşullar
- Node.js (>= v18.x)
- npm veya yarn
- PostgreSQL (>= v12)
- Git

## Kurulum

### Depoyu Klonlama
```bash
git clone https://github.com/WeAreTheArtMakers/copyminds.git
cd copyminds
```

### Bağımlılıkların Yüklenmesi
```bash
npm install
# veya
# yarn install
```

### Çevresel Değişkenler
Proje kök dizininde `.env.example` dosyasını `.env` olarak kopyalayın ve içindeki değerleri güncelleyin:

```dotenv
# .env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgres://user:password@localhost:5432/copymind
JWT_SECRET=supergizlisifre
```

## Veritabanı Yapılandırması
Göç dosyalarını çalıştırarak tablo yapılarını oluşturun:

```bash
npm run migrate
# veya
# yarn migrate
```

Gerekirse başlangıç verilerini (seed) ekleyin:
```bash
npm run seed
# veya
# yarn seed
```

## Çalıştırma
Geliştirme modunda:
```bash
npm run dev
# veya
# yarn dev
```

Üretim modunda:
```bash
npm start
# veya
# yarn start
```

Sunucu `http://localhost:4000` adresinde çalışacaktır.

## API Dokümantasyonu
Tüm API uç noktaları Swagger ile dokümante edilmiştir. `http://localhost:4000/api-docs` adresini ziyaret ederek detayları görebilirsiniz.

### Temel Endpoints
- `POST /auth/register` – Kullanıcı kayıt
- `POST /auth/login` – Giriş (JWT al)
- `GET /users` – Kullanıcı listesi (auth gerektirir)
- `GET /requests` – Tüm içerik istekleri
- `POST /requests` – Yeni içerik isteği oluştur
- `GET /requests/:id` – Belirli isteğin detayları
- `PUT /requests/:id` – İsteği güncelle
- `DELETE /requests/:id` – İsteği sil

## Testler
Birim ve entegrasyon testlerini çalıştırın:
```bash
npm test
# veya
# yarn test
```

## CI/CD ve Dağıtım
- Proje GitHub Actions ile test ve linter aşamalarından geçer.
- Her `main` güncellemesinde Docker imajı oluşturulur ve Docker Hub'a gönderilir.
- Kubernetes veya Docker Compose ile üretime alınabilir.

## Katkıda Bulunanlar
- [Adınız Soyadınız](https://github.com/WeAreTheArtMakers/copyminds)
- [Diğer Katkıcı](https://github.com/barangulesen)

## Lisans
WATAM
