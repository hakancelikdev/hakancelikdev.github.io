---
publishDate: 2026-04-26T06:00:00Z
author: Hakan Çelik
title: "Token Nedir? AI Modelleri Metni Nasıl Okur ve Nasıl Ücretlendirilir?"
excerpt: "AI modelleri metni ne kelime ne karakter olarak okur — token adı verilen parçalar halinde okur. Bu farkı anlamak, context limitlerini, fiyatlandırmayı ve modelin 'unutmasını' bir anda açıklıyor."
category: Yapay Zeka
image: ~/assets/images/blog/token.jpg
tags:
  - yapay-zeka
  - token
  - llm
  - fiyatlandirma
  - context-window
---

## AI Modelleri Metni Nasıl Görür?

Bir AI modeline mesaj gönderdiğinizde, model o metni ne karakter karakter ne de kelime kelime okur. Bunun yerine **token** adı verilen parçalara böler.

Token; bir kelime, bir kelime parçası ya da bir noktalama işareti olabilir. Bunu anlamanın en hızlı yolu somut örneklere bakmak:

```
"Merhaba"      → ["Mer", "hab", "a"]           → 3 token
"Hello"        → ["Hello"]                      → 1 token
"ChatGPT"      → ["Chat", "G", "PT"]           → 3 token
"tokenization" → ["token", "ization"]           → 2 token
```

Hemen dikkat çeken bir şey var: **Türkçe, İngilizce'ye göre çok daha fazla token tüketir.** Bunun nedeni, büyük dil modellerinin büyük çoğunluğunun İngilizce ağırlıklı verilerle eğitilmiş olması. Model, İngilizce kelimeleri bütün olarak tanırken Türkçe kelimeleri daha küçük parçalara böler.

Bu sadece teknik bir detay değil — doğrudan cebinize yansıyan bir farktır.

---

## Tokenization: Metnin Parçalara Bölünmesi

Bu sürece **tokenization** denir. Her model kendi tokenizer'ını kullanır. OpenAI'nin GPT modelleri `tiktoken` kütüphanesini, Meta'nın LLaMA modelleri kendi BPE (Byte Pair Encoding) tokenizer'ını kullanır.

BPE'nin çalışma mantığı şu: eğitim verilerinde sık birlikte görünen karakter dizileri zamanla tek bir token haline gelir. "ing", "tion", "er" gibi İngilizce son ekler tek tokendır. Türkçe'deki "-mek", "-yor", "-lar" gibi son ekler ise genellikle ayrı tokenize edilir.

Bunu kendiniz test edebilirsiniz:

```python
import tiktoken

enc = tiktoken.encoding_for_model("gpt-4")

metinler = [
    "Hello, how are you?",
    "Merhaba, nasılsın?",
    "Tokenization is important",
    "Tokenizasyon önemlidir",
]

for metin in metinler:
    tokens = enc.encode(metin)
    print(f"{len(tokens):2d} token | {metin}")
```

Çıktı yaklaşık şöyle olacak:
```
 5 token | Hello, how are you?
 7 token | Merhaba, nasılsın?
 4 token | Tokenization is important
 6 token | Tokenizasyon önemlidir
```

Aynı anlama gelen Türkçe cümle, İngilizce'ye göre %30-50 daha fazla token tüketiyor. Bu hem maliyet hem de context window açısından önemli.

---

## Context Window: Token Tankı

Her modelin bir **context window** sınırı vardır — modelin aynı anda görebileceği maksimum token sayısı.

| Model | Context Window |
|---|---|
| GPT-3.5 Turbo | 16.000 token |
| GPT-4o | 128.000 token |
| Claude Sonnet 4.5 | 200.000 token |
| Llama 3.1 70B | 128.000 token |

Bu sınır, sadece senin mesajın için değil. **Konuşmanın tamamı** bu havuzdan beslenir:

```
Context Window = sistem promptu
               + önceki tüm mesajlar (siz + model)
               + şu anki mesajınız
               + modelin vereceği cevap
```

Uzun bir sohbet yaptığınızda ya da büyük bir dosya yapıştırdığınızda context window dolmaya başlar. Limit aşıldığında model en eski mesajları "unutur" — aslında o token'lar artık context'inde değildir, göremez.

Modelin "hafıza kaybı" denen şey budur. Teknik bir kısıtlama, karakterin değil.

[RAG nedir?](/rag-nedir-retrieval-augmented-generation) yazısında anlattığım neden tam da bu: tüm dokümanı context'e doldurmak yerine, soruyla ilgili parçaları seçip göndermek — token bütçesini akıllıca kullanmak.

---

## Fiyatlandırma: Her Token'ın Bir Bedeli Var

AI API'leri token başına ücretlendirilir. İki ayrı fiyat vardır:

- **Input token**: modele gönderdiğin metin (prompt + context)
- **Output token**: modelin ürettiği cevap

Output token neden daha pahalı? Çünkü her output token üretmek için model hesaplama yapar — input'u okumak pasif, output üretmek aktif bir işlem.

Nisan 2026 itibarıyla örnek fiyatlar (1 milyon token başına USD):

| Model | Input | Output |
|---|---|---|
| GPT-4o | $2.50 | $10.00 |
| Claude Sonnet 4.5 | $3.00 | $15.00 |
| GPT-4o mini | $0.15 | $0.60 |
| Claude Haiku 4.5 | $0.80 | $4.00 |

1 milyon token yaklaşık 750.000 kelime — yani birkaç roman. Tek bir API çağrısı için bu miktara ulaşmak zor, ama binlerce kullanıcısı olan bir uygulama için bu rakamlar çok hızlı birikir.

### Prompt Caching

Anthropic ve OpenAI, sık tekrarlanan uzun promptlar için **prompt caching** sunuyor. Sistem promptunuz her istekte aynıysa (ki genellikle öyledir), cache'lenmiş versiyonu çok daha düşük fiyata kullanabilirsiniz:

- Anthropic: cache'lenmiş input token'lar standart fiyatın **%10'u**
- Bu, uzun sistem promptu kullanan uygulamalarda maliyeti dramatik biçimde düşürür

---

## Embedding Modelleri Çok Daha Ucuz

[RAG kurulumunda](/rag-nedir-retrieval-augmented-generation) embedding modeli kullandım — metin vektöre dönüştüren model. Bunlar da token bazlı fiyatlandırılır ama büyük dil modellerine kıyasla çok daha ucuzdur:

| Model | Fiyat (1M token) |
|---|---|
| text-embedding-3-small | $0.02 |
| text-embedding-3-large | $0.13 |
| Claude Sonnet 4.5 (input) | $3.00 |

Binlerce dokümanı indexlemek, tek bir GPT-4 konuşmasından bile ucuz olabilir.

---

## Token'ı Anlamak Neyi Değiştiriyor?

Token kavramını öğrenmeden önce AI davranışlarının pek çoğu gizemli görünüyordu:

- Neden model uzun sohbette önceki şeyleri unutuyor? → Context window doldu
- Neden Türkçe kullanmak daha pahalı? → Daha fazla token tüketiyor
- Neden kısa cevap istemek maliyet düşürüyor? → Output token azalıyor
- RAG neden işe yarıyor? → Token bütçesini boşa harcamadan doğru bilgiyi sağlıyor
- Neden sistem promptunu kısa tutmalısın? → Her istekte input token olarak sayılıyor

Token, AI ekosisteminin temel para birimidir. Bunu anladıktan sonra hem daha iyi uygulama yazarsınız hem de faturanızı kontrol altında tutarsınız.
