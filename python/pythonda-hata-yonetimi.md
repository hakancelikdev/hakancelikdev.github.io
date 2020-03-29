# Python'da Hata Yönetimi

## Python'da Hata Yakalama

Şimdiye kadar anlattığım konularda hiç hatalardan, onları nasıl yakalayabileceğimizden, ve gelen hataya göre nasıl işlemlerimizi devam ettirebileceğimizden hiç bahsetmemiştim ama bu konu oldukça önemli bir konudur ve burda bunları öğreneceksiniz.

Size ufak bir örnek vereceğim

```python
get_n = float(input("Bir sayı giriniz >> "))
result = 10 / get_n
print(f"sonuç {result}")
```

Böyle bir programda kullanıcı 1, 2 değilde 0 girerse ne olur ? hatalardan biri gerçekleşir ve programımız istediğimiz gibi bir sonuç vermez, siz burda 0 girme durumunu `if` ile kontrol edebilirdiniz veya bunu için python'da hata yakalama olayını kullanabilirsiniz.

Aşağıda gerçekleşen hatayı nasıl bulduğumuza dair bir script var.

```python
try:
    1 / 0
except Exception as exc:
    print(f"Aman aman! {exc.__class__.__name__} hatasını yakaladık")
```

**Çıktımız;**

`Aman aman! ZeroDivisionError hatasını yakaladık`

Gördüğünüz gibi bir sayının 0 ile bölümünden aldığımız hata `ZeroDivisionError`'dır.

## Belirli Hataları Yakalamak

### Try, Except

#### Genel Yapısı

```python
try:
   # bazı kodlarım
   pass
except ValueError:
   # ValueError hatası yakalanırsa çalışacak kodlarım
   pass
except (TypeError, ZeroDivisionError):
   # Birden fazla hata yakalama
   # TypeError ve ZeroDivisionError hataları gerçekleşirse çalışacak kodlarım
   pass
except Exception:
   # Yukarıdaki hatalar dışında başka bir hata gerçekleşirse çalışacak kodlarım
   pass
```

### Try, Except, As

Burdaki `as` in amacı, yakaladığımız exception instance'ini bir isime atamaktır.

#### Genel Yapısı 1

```python
try:
   # bazı kodlarım
   pass
except ValueError as error:
   # ValueError hatasu yakalanırsa error adında alıyorum ve print ediyorum
   print(error)
```

#### Genel Yapısı 2

```python
try:
   # bazı kodlarım
   pass
except Exception as e:
   # herhangi bir hata yakalanırsa e adında alıyorum ve print ediyorum
   print(e)
```

### Try, Except, Else

#### Genel Yapısı

```python
try:
   # bazı kodlarım
   pass
except:
   # herhangi bir hata yakalanırsa çalışacak kodlarım
   pass
else:
    # hata olmaz ise çalışacak kodlarım.
    pass
```

### Try, Except, Else, Finally

#### Genel Yapısı

```python
try:
   # bazı kodlarım
   pass
except:
   # herhangi bir hata yakalanırsa çalışacak kodlarım
   pass
else:
    # hata olmaz ise çalışacak kodlarım.
    pass
finally:
    # hata olsada olmasada çalışacak kodlarım
    pass
```

## Kendi Hata Sınıfımızı Oluşturup Hata Verelim

Bunu yapmak için `Exception` sınıfını ve `raise` keyword'ünü kullanacağız.

### Raise

`raise` herhangi bir hata sınıfını ayağa kaldırmak için kullanılan bir keyword'dür.

Şimdi en başta verdiğimiz örneği tekrar yapalım.

```python
class InputError(Exception):
    """İnput'daki hatalar için bir sınıf oluşturduk.

    Attributes:
        expression - hatanın oluştuğu girdi ifadesi
        message - hatanın açıklaması

        expression -- input expression in which the error occurred
        message -- explanation of the error
    """

    def __init__(self, expression, message):
        self.expression = expression
        self.message = message

input_ = float(input("0 hariç bir sayı girin >> "))
if input_ == 0:
    raise InputError(input_, "0 yazmayın")
```

**Sonuç**

```text
Traceback (most recent call last):
  File "myapp.py", line 28, in <module>
    raise InputError(input_, "0 yazmayın")
__main__.InputError: (0.0, '0 yazmayın')
```

şimdi biraz daha güzelleştirelim ve dönderdiğimiz hatayıda yakalayım

```python
class InputError(Exception):
    """İnput'dali hatalar için bir sınıf oluşturduk.

    Attributes:
        expression - hatanın oluştuğu girdi ifadesi
        message - hatanın açıklaması

        expression -- input expression in which the error occurred
        message -- explanation of the error
    """

    def __init__(self, expression, message):
        self.expression = expression
        self.message = message

def get_input():
    input_ = float(input("0 hariç bir sayı girin >> "))
    if input_ == 0:
        raise InputError(input_, "0 yazmayın")
    return input_

try:
    input_ = get_input()
except InputError as e: # dönen hata eğer bizim kodladığımız InputError ise
    print(e)
else:
    print(input_)
```

**Sonuç**

```text
0 hariç bir sayı girin >> 0
(0.0, '0 yazmayın')
```

## Python Built-in Exceptions

| Exception | Cause of Error |
| :--- | :--- |
| AssertionError | `Assert` ifadesi \( statement \) başarısız olduğunda yükselir \( raise eder \). |
| AttributeError | Özellik ataması veya referans başarısız olduğunda yükselir \( raise eder \). |
| EOFError | `İnput ()` fonksiyonu dosya sonu durumuna geldiğinde ortaya çıkar \( raise eder \). |
| FloatingPointError | floating-point işlemi başarısız olduğunda raise eder. |
| GeneratorExit | Generator'ün `close()` methodu çağrıldığında raise eder |
| ImportError | İmport edilen modül bulunamadığında raise eder. |
| IndexError | İndex dizi dışında olduğunda raise eder. |
| KeyError | Raised when a key is not found in a dictionary. |
| KeyboardInterrupt | Raised when the user hits interrupt key \(Ctrl+c or delete\). |
| MemoryError | Raised when an operation runs out of memory. |
| NameError | Raised when a variable is not found in local or global scope. |
| NotImplementedError | Raised by abstract methods. |
| OSError | Raised when system operation causes system related error. |
| OverflowError | Raised when result of an arithmetic operation is too large to be represented. |
| ReferenceError | Raised when a weak reference proxy is used to access a garbage collected referent. |
| RuntimeError | Raised when an error does not fall under any other category. |
| StopIteration | Raised by `next()` function to indicate that there is no further item to be returned by iterator. |
| SyntaxError | Raised by parser when syntax error is encountered. |
| IndentationError | Raised when there is incorrect indentation. |
| TabError | Raised when indentation consists of inconsistent tabs and spaces. |
| SystemError | Raised when interpreter detects internal error. |
| SystemExit | Raised by `sys.exit()` function. |
| TypeError | Raised when a function or operation is applied to an object of incorrect type. |
| UnboundLocalError | Raised when a reference is made to a local variable in a function or method, but no value has been bound to that variable. |
| UnicodeError | Raised when a Unicode-related encoding or decoding error occurs. |
| UnicodeEncodeError | Raised when a Unicode-related error occurs during encoding. |
| UnicodeDecodeError | Raised when a Unicode-related error occurs during decoding. |
| UnicodeTranslateError | Raised when a Unicode-related error occurs during translating. |
| ValueError | Raised when a function gets argument of correct type but improper value. |
| ZeroDivisionError | Raised when second operand of division or modulo operation is zero. |

Aşağıdaki ağaç yapısında hangi hata nesnesinin hangi nesneden türetildiği açıkça görünüyor.

```text
BaseException
 +-- SystemExit
 +-- KeyboardInterrupt
 +-- GeneratorExit
 +-- Exception
      +-- StopIteration
      +-- StopAsyncIteration
      +-- ArithmeticError
      |    +-- FloatingPointError
      |    +-- OverflowError
      |    +-- ZeroDivisionError
      +-- AssertionError
      +-- AttributeError
      +-- BufferError
      +-- EOFError
      +-- ImportError
      |    +-- ModuleNotFoundError
      +-- LookupError
      |    +-- IndexError
      |    +-- KeyError
      +-- MemoryError
      +-- NameError
      |    +-- UnboundLocalError
      +-- OSError
      |    +-- BlockingIOError
      |    +-- ChildProcessError
      |    +-- ConnectionError
      |    |    +-- BrokenPipeError
      |    |    +-- ConnectionAbortedError
      |    |    +-- ConnectionRefusedError
      |    |    +-- ConnectionResetError
      |    +-- FileExistsError
      |    +-- FileNotFoundError
      |    +-- InterruptedError
      |    +-- IsADirectoryError
      |    +-- NotADirectoryError
      |    +-- PermissionError
      |    +-- ProcessLookupError
      |    +-- TimeoutError
      +-- ReferenceError
      +-- RuntimeError
      |    +-- NotImplementedError
      |    +-- RecursionError
      +-- SyntaxError
      |    +-- IndentationError
      |         +-- TabError
      +-- SystemError
      +-- TypeError
      +-- ValueError
      |    +-- UnicodeError
      |         +-- UnicodeDecodeError
      |         +-- UnicodeEncodeError
      |         +-- UnicodeTranslateError
      +-- Warning
           +-- DeprecationWarning
           +-- PendingDeprecationWarning
           +-- RuntimeWarning
           +-- SyntaxWarning
           +-- UserWarning
           +-- FutureWarning
           +-- ImportWarning
           +-- UnicodeWarning
           +-- BytesWarning
           +-- ResourceWarning
```

## Yararlanılan Kaynaklar

* [https://docs.python.org/3/library/exceptions.html](https://docs.python.org/3/library/exceptions.html)
* [https://belgeler.yazbel.com/python-istihza/hata\_yakalama.html](https://belgeler.yazbel.com/python-istihza/hata_yakalama.html)
* [https://docs.python.org/3/tutorial/errors.html](https://docs.python.org/3/tutorial/errors.html)
* [https://www.programiz.com/python-programming/exceptions](https://www.programiz.com/python-programming/exceptions)
* [https://realpython.com/python-exceptions/](https://realpython.com/python-exceptions/)

