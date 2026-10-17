---
title: What are GAMs?
slug: GAMs
description: An introduction to Generalized Additive Models and how they differ from other models.
date: 2026-10-11
categories:
  - Machine Learning
---

> Note: This blog was written for people who have already some basic knowledge in ML. Apologies.

If you would have heard of famous Python lib, `pyGAM` or famous R lib, `mgcv`, you would found yourself face to face with a new model in the ML world, GAM.

So what is a GAM really?

GAMs = Generalized Additive Models.

That led me to the Wikipedia page: <https://en.wikipedia.org/wiki/Generalized_additive_model>

Which, personally gave my noob self no clarity, but an almost familiar equation:

$$
g(\operatorname{E}(Y)) = \beta_{0} + f_{1}(x_{1}) + f_{2}(x_{2}) + \cdots + f_{m}(x_{m}).
$$

An easier definition of the same would be:

> They're a type of machine learning/statistical model that helps us understand how different things affect an outcome, especially when the relationships aren't straight lines.

Now that vague equation and definition led me to the next logical question...

## How are GAMs different from other models?

The equation, immediately led my mind to imagine multivariable linear regression with some L1 and L2 regularization (Lasso & Ridge respectively). And the definition stating, "when the relationships aren't straight lines" led me to polynomial regression and so many other ML models out there.

So, why are GAMs special?

- It is simpler than models like XGBoost, SHAP etc.
- While linear regression works on lines, and polynomial regression works on actual curves, GAMs work on "splines" (let's see ahead).

Visually each of those look something like this:

<figure class="image-comparison">
  <div class="image-comparison__images">
    <img src="/images/line.png" alt="A straight line representing linear regression" loading="lazy" decoding="async">
    <img src="/images/splineline.png" alt="A smooth curved spline" loading="lazy" decoding="async">
  </div>
  <figcaption>Line vs Spline</figcaption>
</figure>

<figure class="image-comparison">
  <div class="image-comparison__images">
    <img src="/images/splinepoly.png" alt="A smooth spline with gradual bends" loading="lazy" decoding="async">
    <img src="/images/poly.png" alt="A polynomial curve with repeated peaks and valleys" loading="lazy" decoding="async">
  </div>
  <figcaption>Spline of a GAM vs A curve for Polynomial Regression</figcaption>
</figure>

> All splines are curves, but not All curves are splines.

## What happens inside a GAM?

Now if you look carefully at the equation, you will notice that when in normal Linear Regression we use variables with coefficients, here we have functions instead.

Let's take an example to go on further with it:

Suppose we want to predict someone's salary using their age and years of experience.

Then A GAM has this structure:

$$
\hat y = \beta_0 + f_1(Age) + f_2(Experience)
$$

Where Mathematically:

$$
f_1(Age) = w_1B_1(Age) + w_2B_2(Age) + w_3B_3(Age)
$$

- $B_1, B_2, B_3$ are spline basis functions.
- $w_1, w_2, w_3$ are coefficients the model learns from data. (Weights per feature, learnt as any other ML model through optimizations for all variables together to get a sweet spot, by the method name "Penalized Least Squares")

This is basically linear regression, except we're applying it to spline features instead of the original variable.

At a different age, the basis function values change, so the age contribution changes too.
That's how a GAM produces a spline, basis functions are responsible for Spline transformations.

## Basis functions and Splines

Now as per the equation above, we can see that a Spline for a GAM is made by several basis functions. We can form different types of Splines for a GAM by choosing different types of Basis functions.

we can make a **Linear Spline** if we take:

$$
B_1(x) = x
$$

$$
B_2(x) = \max(0, x - 30)
$$

$$
B_3(x) = \max(0, x - 50)
$$

(where x is Age)

**Assumptions**:

We choose two ages where we allow the relationship to change direction:

- Age 30
- Age 50

These points are called **knots**.


We can also make a **Cubic Spline** if we take:

$$
B_1(x) = x^3
$$

$$
B_2(x) = \max(0, x - 30)^3
$$

$$
B_3(x) = \max(0, x - 50)^3
$$

And Similarly, other different types of Splines


> This differentiates Polynomial Regression and a GAM with a Spline, because in the former, we use a **single** equation, that forms a curve, whereas the latter uses different equations combinedly, i.e. a **piecewise** function that forms a curve.
Splines avoid the wild, erratic swinging (oscillations) that happen when you try to fit a single high-degree polynomial through too many data points. 


Continuing with the Linear Spline transformations for simplicity:

Take Age = 40

$$
B_1(40) = 40
$$

$$
B_2(40) = \max(0, 40 - 30) = 10
$$

$$
B_3(40) = \max(0, 40 - 50) = 0
$$

So:

| Original Age | $B_1$ | $B_2$ | $B_3$ |
| --- | --- | --- | --- |
| 40 | 40 | 10 | 0 |


Three transformed features


Look at the transformation across different ages:

| Age | $B_1 = Age$ | $B_2 = \max(0, Age - 30)$ | $B_3 = \max(0, Age - 50)$ |
| --- | --- | --- | --- |
| 20 | 20 | 0 | 0 |
| 30 | 30 | 0 | 0 |
| 40 | 40 | 10 | 0 |
| 50 | 50 | 20 | 0 |
| 60 | 60 | 30 | 10 |

we see that we took ONE feature (Age) and converted it into THREE features using exact mathematical functions.

Suppose the model learns the following Weights:

$$
a_1 = 1, \quad a_2 = 3, \quad a_3 = -4
$$

Then Age's total contribution is:

$$
f(Age) = Age + 3\max(0, Age - 30) - 4\max(0, Age - 50)
$$

| Age | Calculation | Age effect |
| --- | --- | --- |
| 20 | $20 + 3(0) - 4(0)$ | 20 |
| 30 | $30 + 3(0) - 4(0)$ | 30 |
| 40 | $40 + 3(10) - 4(0)$ | 70 |
| 50 | $50 + 3(20) - 4(0)$ | 110 |
| 60 | $60 + 3(30) - 4(10)$ | 110 |

Plotting these points we see a Graph like:

<figure>
  <img src="/images/linearspline.svg" alt="Linear Spline for Age" loading="lazy" decoding="async">
  <figcaption>Linear spline for the feature <strong>AGE</strong></figcaption>
</figure>


This is **only** for feature Age, similarly we can make the same for different features.

Which combinedly will come as:

$$
f_1(Age) = a_1B_1(Age) + a_2B_2(Age) + a_3B_3(Age)
$$

$$
f_2(Experience) = c_1C_1(Experience) + c_2C_2(Experience)
$$

Substitute these back into the GAM:

$$
\begin{aligned}
\hat y = \beta_0
&+ a_1B_1(Age) \\
&+ a_2B_2(Age) \\
&+ a_3B_3(Age) \\
&+ c_1C_1(Experience) \\
&+ c_2C_2(Experience)
\end{aligned}
$$

Now the model becomes something like:

$$
\hat y = \beta_0 +
\sum_{j=1}^{n} a_jB_j(Age)
+ \sum_{j=1}^{n} c_jC_j(Exp)
$$

or in other words:

$$
\hat y = \beta_0 + f_1(Age) + f_2(Experience)
$$

the original form we started from.

## Difference in Training

Taking an analogy, ordinary linear regression minimizes:

$$
\underbrace{\sum_i(y_i-\hat y_i)^2}_{\text{Prediction error}}
$$

A typical spline-based GAM minimizes:

$$
\underbrace{\sum_i(y_i-\hat y_i)^2}_{\text{Prediction error}}
+
\underbrace{\lambda_1\int [f_1''(t)]^2\,dt}_{\text{Age smoothness penalty}}
+
\underbrace{\lambda_2\int [f_2''(t)]^2\,dt}_{\text{Experience smoothness penalty}}
$$

The second and third terms penalize excessive curvature.

The difference from regularization in regression:

- Regularization typically penalizes large coefficients, or reduce weak features to zero contribution.
- GAM typically penalizes excessive wiggliness of the learned curves.

## Programmatic implementation of GAMs

Coming back to the libraries I mentioned in the very start `mgcv`, `pyGAM` etc., what happens inside their model imports and fits? I will talk mainly about `pyGAM`.

When we do something like:

```python
from pygam import LinearGAM, s

gam = LinearGAM(
    s(0, n_splines=6, spline_order=3, lam=10) +
    s(1, n_splines=6, spline_order=3, lam=10)
)

gam.fit(X, y)
```

pyGAM generally does NOT learn the knot positions and regression coefficients together.
It does the same in the following order:

1. Decide the spline structure: How many spline basis functions? What degree? Where are the knots?
2. Transform the original features: Convert Age, Experience, etc. into spline basis columns.
3. Learn regression coefficients: Fit one joint regression using those transformed columns.
4. Apply smoothness regularization: Prevent the learned curves from becoming unnecessarily wiggly.
5. Tune smoothness if requested: Choose how flexible the curves should be.


AND that's a wrap on basics of GAMs.
Thank you.
