---
publishDate: 2021-06-15T00:00:00Z
author: Hakan Çelik
title: "If, Elif, and Else Conditional Statements"
excerpt: "To understand this topic you need to know the Comparison Operators from the operators article I wrote. Feel free to review that article and then come back to this one."
category: Python
image: ~/assets/images/blog/python.jpg
tags:
  - python
---

# If, Elif, and Else Conditional Statements

To understand this topic you need to know the **Comparison Operators** from the operators
article I wrote. Feel free to review that article and then come back to this one; I'm
leaving you a link:
[@hakancelik/islecler-ve-print-fonksiyonu](https://www.coogger.com/@hakancelik/islecler-print-ve-input-fonksiyonlar-kacs-dizileri/)

### What Are Conditional Statements?

Conditional statements are code blocks that exist in every programming language and
allow us to check one condition before another condition can run. If we describe them
verbally in an algorithmic way, the logic works like this:

```text
st=>start: Measure the weight of the load
cond=>condition: Is the load heavier than 30 kg?
single=>end: Go call for help
help=>end: Lift it

st->cond
cond(yes)->single
cond(no)->help
```

As you can see above, the block that splits into **yes, no** and performs different
actions depending on the answer is made possible by conditional statements.

In Python there are 3 conditional statements, written below:

- **if**
- **elif**
  - elif is called **else if** in other programming languages; Python uses the shortened form.
- **else**

\[=====================\]

## The if Conditional Statement

If you recall from
[@hakancelik96/islecler-ve-print-fonksiyonu](https://www.coogger.com/@hakancelik96/islecler-print-ve-input-fonksiyonlar-kacs-dizileri/),
we mentioned that every object in Python has a **bool** value, i.e. **True** or
**False**. We are now going to use that knowledge, but how? In reality, **the only thing
conditional statements care about is whether the object given to them as a condition is
true or not** — that's all there is to it.

To give an example, when we write **if "hakan"**, Python only looks at whether the
condition given to the **if** statement (i.e. the "hakan" object) is true or not. If
the condition is true, the **if** block runs; if false, it does not.

We can understand this better by examining the code below.

```python
if True: # the condition in the if statement is True
    print("if condition is true") # so the code runs
print("this part is outside the if block.")
```

Output:

`"if condition is true"`

```python
if False: # the condition in the if statement is False
    print("if condition is false") # so this code does not run
```

The script above produces no output because the condition provided is False.

Additionally, you may have noticed that to indicate the code block below the **if**
statement belongs to it, we left 4 spaces, and we wrote `if <condition>:`. Python uses
these spaces and the **:** colon to determine which block belongs to whom. If you're using
an editor like Atom, it will automatically add 4 spaces when you type **:** and press Enter.
As a comparison, in C++ the same code above would be written like this:

```c
if (true){
    // this section runs if the if condition is true
    cout<<"if condition is true"<<endl;
}
// this section runs whether the if is true or not — it's outside the if block
```

C++ uses **{}** braces to determine this, but Python uses its indentation structure.
4 spaces is not strictly required — you can use any number — but 4 is set by the PEP 8
style guide and is used universally.

The if conditional statement is always checked. If you're wondering what that means,
you'll understand better once you've read about elif and else, but let's do a simple
example now as a preview.

```python
if True:
    print("first true")
if False:
    print("non-running line")
if True:
    print("second true")
if False:
    print("second non-running line")
```

There are 4 if statements above. As Python reads this script from top to bottom, it
checks each if statement to see whether its condition is True or False, and runs every
one that is True (this behaviour is different for elif and else). Therefore our output
will be:

```python
"first true"
"second true"
```

## The elif Conditional Statement

The **elif** conditional statement has very little difference from **if**. In words: if
the condition given to the **if** statement is **False**, look at the next **elif**
statement; if the condition given to it is **True**, run it. If an elif runs, do not look
at the next elif; if it does not run, look at the next elif. Let me explain with code:

```python
if False:
    print("won't run")
elif True:
    print("elif ran")
elif True:
    print("second elif did not run because one elif already ran")
```

The result will be `"elif ran"`. If you didn't fully grasp that, look at the next one.

```python
if True:
    print("only this will run, elifs won't")
elif True:
    print("elif won't run because the if condition is true")
elif True:
    print("elif won't run because the if condition is true")
```

Our output will be `"only this will run, elifs won't"` because, as stated, the if
condition is true — so Python won't even look at the subsequent elif statements. One
more example:

```python
if False:
    print("won't run")
elif False:
    print("this won't run either because it's False")
elif True:
    print("runs")
if True:
    print("this is a separate if and it also runs — remember, Python checks every if and runs it if the condition is True")
```

I hope the note I wrote while explaining the if topic is now clear.

## The else Conditional Statement

- The **else** conditional statement runs when **if** does not run — i.e., when the if
  condition is **False** — and when none of the other conditional statements have run.
- Unlike if and elif, it does not take a condition object before it, because **the
  condition for else to run is what I wrote above**. Since it is already implied, it is
  not specified separately and Python does not allow it.

```python
if False:
    print("won't run")
elif False:
    print("won't run")
elif False:
    print("won't run")
else:
    print("else runs")
```

Since no condition ran, the else block ran.

```python
if False:
    print("won't run")
else:
    print("else runs")
```

Let's give one final example using operators and wrap up. I was purposely using True and
False examples above so you could see that the only thing conditional statements care
about is the bool value of objects. Now let's use operators and other things:

```python
if 2>1:
    print("2 is greater than 1")
else:
    print("1 is greater than 2")
if 3 == 2:
    print("3 equals 2")
elif 3 != 4:
    print("3 does not equal 4")

if "hakan":
    print("as you can see, the bool value of 'hakan' is", bool("hakan"))

if 0:
    print("the condition is written as the object 0")
else:
    print("the bool value of 0 is", bool(0))
```
