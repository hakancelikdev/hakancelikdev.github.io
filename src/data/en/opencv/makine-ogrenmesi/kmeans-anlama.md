---
publishDate: 2022-06-13T00:00:00Z
author: Hakan Çelik
title: "Understanding K-Means Clustering"
excerpt: "Learn the concepts of K-Means Clustering algorithm. We go through the step-by-step algorithm using a T-shirt size problem to explain how iterative centroid updates work."
category: OpenCV
series: "OpenCV Series"
seriesIndex: 54
subcategory: Machine Learning
image: /images/posts/opencv/kmeans_begin.jpg
tags:
  - opencv
  - python
  - görüntü-işleme
---

# Understanding K-Means Clustering

## Goal

In this chapter, we will understand the concepts of K-Means Clustering, how it works etc.

## Theory

Consider a company, which is going to release a new model of T-shirt to market. They will have to manufacture models in different sizes to satisfy people of all sizes. So the company makes a data of people's height and weight, and plots them on to a graph:

![T-shirt beginning](/images/posts/opencv/kmeans_begin.jpg)

Company can't create t-shirts with all the sizes. Instead, they divide people to Small, Medium and Large, and manufacture only these 3 models. This grouping of people into three groups can be done by k-means clustering, and algorithm provides us best 3 sizes:

![K-Means Demo](/images/posts/opencv/kmeans_demo.jpg)

## How does it work?

This algorithm is an iterative process:

**Step 1:** Algorithm randomly chooses two centroids, C1 and C2.

**Step 2:** It calculates the distance from each point to both centroids. If a test data is more closer to C1, then that data is labelled with '0'. If it is closer to C2, then labelled as '1'.

**Step 3:** Next we calculate the average of all blue points and red points separately and that will be our new centroids.

**Steps 2 and 3** are iterated until both centroids are converged to fixed points. These points are such that sum of distances between test data and their corresponding centroids are minimum:

**J = Σ distance(C1, Red_Point) + Σ distance(C2, Blue_Point)** → minimize

---

**Source:** [OpenCV Python Tutorials — Original Documentation](https://github.com/opencv/opencv/blob/4.x/doc/py_tutorials/py_ml/py_kmeans/py_kmeans_understanding/py_kmeans_understanding.markdown)
