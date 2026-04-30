---
publishDate: 2022-06-11T00:00:00Z
author: Hakan Çelik
title: "SVM'yi Anlamak"
excerpt: "Destek Vektör Makineleri'nin (SVM) sezgisel kavramlarını öğrenin. Karar sınırı, destek vektörleri, marjin maksimizasyonu ve çekirdek yöntemiyle doğrusal olmayan ayrılabilirliği anlattım."
category: OpenCV
series: "OpenCV Serisi"
seriesIndex: 52
subcategory: Makine Öğrenmesi
image: /images/posts/opencv/svm_icon1.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# SVM'yi Anlamak

## Hedefler

Bu bölümde SVM'nin sezgisel bir anlayışını öğreneceğiz.

## Teori

### Doğrusal Olarak Ayrılabilir Veri

İki tür veri içeren bir görüntü düşünün: kırmızı ve mavi. Her iki veriyi iki bölgeye bölen bir **f(x) = ax₁ + bx₂ + c** doğrusu bulalım. Yeni bir test_data X geldiğinde, sadece f(X)'e yerine koyalım: f(X) > 0 ise mavi gruba, değilse kırmızı gruba aittir. Bu doğruya **Karar Sınırı** diyoruz.

Böyle birçok doğru mümkündür. Hangisini seçmeliyiz? Sezgisel olarak, doğrunun tüm noktalardan mümkün olduğunca uzak geçmesi gerektiğini söyleyebiliriz — gelen verilerde gürültü olabileceğinden. SVM, eğitim örneklerine en büyük minimum mesafeye sahip bir doğru (veya hiperplan) bulmaktadır.

Bu Karar Sınırını bulmak için eğitim verilerine ihtiyaç var mı? Hepsine değil. Sadece karşı gruba yakın olanlar yeterli. Bunlara **Destek Vektörleri** diyoruz ve onlardan geçen doğrulara **Destek Düzlemleri** diyoruz.

### Doğrusal Olmayan Ayrılabilir Veri

Bazı veriler düz bir doğruyla iki gruba ayrılamaz. Örneğin, bir boyutlu veri: X -3 ve +3'te, O ise -1 ve +1'dedir. Açıkça doğrusal olarak ayrılamaz. Ancak bu veri kümesini **f(x) = x²** fonksiyonu ile eşleştirebiliriz, bu durumda X 9'da, O ise 1'de olur.

Benzer şekilde, **f(x) = (x, x²)** fonksiyonu kullanarak bu tek boyutlu veriyi iki boyutlu veriye dönüştürebiliriz. X (-3, 9) ve (3, 9) olurken, O (-1, 1) ve (1, 1) olur. Bu doğrusal olarak ayrılabilir hale geldi.

Genel olarak, d boyutlu uzaydaki noktaları D boyutlu uzaya (D > d) eşlemek mümkündür. **Çekirdek fonksiyonu (Kernel function)**, düşük boyutlu özellik uzayında hesaplamalar yaparak yüksek boyutlu çekirdek uzayında iç çarpımı hesaplamaya yardımcı olur.

## OpenCV'de SVM

```python
import cv2 as cv
import numpy as np

# Eğitim verisi
labels = np.array([1, 1, -1, -1])
trainingData = np.matrix([[501, 10], [255, 10], [501, 255], [10, 501]], dtype=np.float32)

# SVM yarat ve eğit
svm = cv.ml.SVM_create()
svm.setType(cv.ml.SVM_C_SVC)
svm.setKernel(cv.ml.SVM_LINEAR)
svm.setTermCriteria((cv.TERM_CRITERIA_MAX_ITER, 100, 1e-6))
svm.train(trainingData, cv.ml.ROW_SAMPLE, labels)
```

---

**Kaynak:** [OpenCV Python Tutorials — Orijinal Döküman](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_ml/py_svm/py_svm_basics/py_svm_basics.markdown)
