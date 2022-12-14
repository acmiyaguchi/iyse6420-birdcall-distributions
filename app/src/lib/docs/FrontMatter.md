<script>
    // get the date part of the iso string
    let buildTime = "__BUILD_TIME__".split("T")[0];
    let show = false;
</script>

Author: [Anthony Miyaguchi](https://acmiyaguchi.me)
Last Modified: {buildTime}

This website demonstrates the results of building birdcall distribution maps with Bayesian modeling methods.
I completed this project for the [IYSE 6420: Bayesian Statistics](https://omscs.gatech.edu/isye-6420-bayesian-statistics) course as part of my Fall 2022 semester in Georgia Tech's [OMSCS](https://omscs.gatech.edu/) program.
See the [project report] and source on [GitHub] for more details.

We use the geographic metadata from the [BirdCLEF 2022](https://www.kaggle.com/c/birdclef-2022) competition dataset to build a map to show the location of birdcall recordings.
We fit the data to a Poisson [Generalized Linear Model (GLM)][glm] to estimate covariate or random effects.

<button on:click={() => show = !show}>
{#if show}
Hide model details
{:else}
Tell me more about the model
{/if}
</button>

{#if show}

We model observations as events drawn from a Poisson distribution with mean $\theta$ where $\theta$ is the rate parameter composed of elements such as features $X$ and random effects $\phi$.
We use a [conditional auto-regressive (CAR)][car] distribution to model spatial random effects (i.e., how strongly neighbors relate to each other).
It is a particular case of the multivariate normal distribution.
$W$ is an adjacency matrix that encodes neighborhood relationships, and $\alpha$ is a scalar that controls the strength of the correlation between neighbors.

$$
\begin{equation}
\phi_i | \mu_i, \tau_i, \alpha, W \sim CAR(\mu_i, \tau_i, \alpha, W)
\end{equation}
$$

We build two models for demonstration.
The first is labeled `intercept_car` which is a linear model with an intercept (effectively the mean) and CAR distribution for the random effects.

$$
\begin{equation}
\begin{aligned}
    Y_i &\sim Poisson(\theta) \\
    \log(\theta) &= \beta_0 + \phi_i \\
    \phi_i &\sim CAR(0, \bar{\tau_\phi}, \alpha, W) \\
    \alpha &\sim Beta(5, 1), \bar{\tau_\phi} \sim Ga(10^{-3}, 10^{-3})
\end{aligned}
\end{equation}
$$

The second is labeled `intercept_covariate_car`, which includes a covariate for each grid cell.
These covariates include population density, average temperature, and land cover classification features that were summarized using Google Earth Engine.
See the [Earth Engine Plots](./earth-engine) page for more details about the features.

$$
\begin{equation}
\begin{aligned}
    Y_{i} &\sim Poisson(\theta) \\
    \log(\theta) &= \beta_{0} + \beta X + \phi_i \\
    \beta_{j} &\sim N(0, 10^{-3}) \\
    \phi_i &\sim CAR(0, \bar{\tau_\phi}, \alpha, W) \\
    \alpha &\sim Beta(5, 1), \bar{\tau_\phi} \sim Ga(10^{-3}, 10^{-3})
\end{aligned}\
\end{equation}
$$

<button on:click={() => show = !show}>
{#if show}
Hide model details
{:else}
Tell me more about the model
{/if}
</button>

{/if}

[glm]: https://en.wikipedia.org/wiki/Generalized_linear_model
[car]: https://docs.pymc.io/en/latest/api/distributions/generated/pymc.CAR.html
[github]: https://github.com/acmiyaguchi/iyse4620-birdcall-distributions
[project report]: https://raw.githubusercontent.com/acmiyaguchi/iyse6420-birdcall-distributions/master/report/2022-12-04-iyse6420_birdcall_distributions.pdf
