# Hakan Çelik - Personal Website

Bu proje, Hakan Çelik'in kişisel web sitesi için MkDocs ve Material for MkDocs kullanılarak oluşturulmuştur.

## 🚀 Özellikler

- **Modern Tasarım**: Material for MkDocs ile modern ve responsive tasarım
- **Hızlı Arama**: Gelişmiş arama özelliği
- **Karanlık/Aydınlık Tema**: Otomatik tema değiştirme
- **SEO Optimizasyonu**: Arama motoru dostu yapı
- **Git Entegrasyonu**: Git revizyon tarihleri ve düzenleme linkleri

## 📋 Gereksinimler

- Python 3.11+
- pip

## 🛠️ Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/hakancelikdev/hakancelikdev.github.io.git
cd hakancelikdev.github.io
```

2. Sanal ortam oluşturun ve aktifleştirin:
```bash
python3.11 -m venv .venv
source .venv/bin/activate  # Linux/Mac
# veya
.venv\Scripts\activate  # Windows
```

3. Bağımlılıkları yükleyin:
```bash
pip install -r requirements.txt
```

## 🚀 Kullanım

### Geliştirme Sunucusu
```bash
mkdocs serve
```
veya
```bash
make docs
```

### Site Oluşturma
```bash
mkdocs build
```
veya
```bash
make build
```

### GitHub Pages'e Deploy
```bash
mkdocs gh-deploy
```
veya
```bash
make deploy
```

## 📁 Proje Yapısı

```
docs/
├── assets/           # Resimler ve statik dosyalar
├── overrides/        # Özel tema dosyaları
├── includes/         # Snippet dosyaları
├── python/          # Python dokümantasyonu
├── django/          # Django dokümantasyonu
├── opencv/          # OpenCV dokümantasyonu
├── git/             # Git dokümantasyonu
├── security/        # Güvenlik dokümantasyonu
├── cloud/           # Cloud dokümantasyonu
└── ...              # Diğer kategoriler
```

## 🔧 Yapılandırma

Ana yapılandırma dosyası `mkdocs.yml`'dir. Bu dosyada:

- Site bilgileri
- Navigasyon yapısı
- Tema ayarları
- Plugin yapılandırmaları
- Markdown uzantıları

tanımlanmıştır.

## 📦 Kullanılan Teknolojiler

- **MkDocs**: Statik site oluşturucu
- **Material for MkDocs**: Modern tema
- **PyMdown Extensions**: Gelişmiş Markdown özellikleri
- **Git Revision Date Plugin**: Git tarih entegrasyonu
- **Minify Plugin**: HTML/CSS/JS sıkıştırma

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 📞 İletişim

- **Website**: [hakancelik.dev](https://hakancelik.dev)
- **Email**: hakancelikdev@gmail.com
- **Twitter**: [@hakancelikdev](https://twitter.com/hakancelikdev)
- **LinkedIn**: [hakancelikdev](https://www.linkedin.com/in/hakancelikdev)

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
