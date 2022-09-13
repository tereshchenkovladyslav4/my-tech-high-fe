# Infocenter V2 Frontend CI/CD

These files define the Github Actions workflows for the automated steps around the CI/CD process.

### On Master Commit

On a push to master (direct, or via PR merge), Github Actions will automatically create a date based tag for the commit for later use and tracking. The React applcation will automatically be linted and built as a safety net.

## Staging Deployment
---

In order to deploy to the Staging environment in AWS, the relevant commit needs to be tagged with `staging` or `staging/*` (`staging/2.1`, etc).

Upon tagging, Github Actions will begin building the React application and bundling for deployment. Once built, the workflow will deploy to AWS S3. Finally, a Cloudfront invalidation will be sent to signal to Cloudfront to pull the latest bundle from S3.

The staging environment can be accessed via `https://v2-staging.mytechhigh.com`.

## Demo Deployment
---

In order to deploy to the Demo environment in AWS, the relevant commit needs to be tagged with `demo` or `demo/*` (`demo/2.1`, etc).

Upon tagging, Github Actions will begin building the React application and bundling for deployment. Once built, the workflow will deploy to AWS S3. Finally, a Cloudfront invalidation will be sent to signal to Cloudfront to pull the latest bundle from S3.

The staging environment can be accessed via `https://v2-demo.mytechhigh.com`.

## Production Deployment
---

In order to deploy to the Production environment in AWS, the relevant commit needs to be tagged with `prod` or `prod/*` (`prod/2.1`, etc).

Upon tagging, Github Actions will begin building the React application and bundling for deployment. Once built, the workflow will deploy to AWS S3. Finally, a Cloudfront invalidation will be sent to signal to Cloudfront to pull the latest bundle from S3.

The staging environment can be accessed via `https://infocenter.tech`.

## Contributors / SMEs
---

If you have any questions, need functionality added, or are just curious about these steps, feel free to reach out to Collin Meadows at collin.meadows@tech304.com.