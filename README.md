# BluElephant Water Analyzer

**BluElephant Water Analyzer** — a web-based tool supporting the **BluElephant** decentralized wastewater treatment system by enabling intuitive tracking and analysis of water sample data.

## What does this app do?

This application helps you store, organize, and analyze measurements from water samples collected at various stages of the treatment process — including **influent**, **effluent**, and **sludge**.

It allows you to explore historical trends in selected parameters, compare sample types, and export data for external analysis. The app also includes a prototype **prediction feature** that flags samples potentially exceeding legal limits, based on an early-stage machine learning model.

## Key Features

- **Sample management** for multiple categories: influent, effluent, and sludge.
- **Dynamic parameter analysis** with visual charts and filters.
- **Data export** to Excel or CSV for offline work or reporting.
- **Prototype prediction module** that uses a Random Forest model to detect potential legal threshold exceedance.
- **History view** to review and analyze past samples.

## Technologies Used

- **Backend:** [FastAPI](https://fastapi.tiangolo.com) — a high-performance Python web framework.
- **Database:** [SQLite](https://www.sqlite.org/index.html) — lightweight and serverless, suitable for small-scale deployments.
- **Machine Learning:** Random Forest Classifier (prototype feature).
- **Frontend:** [React](https://react.dev) — a modern library for building responsive user interfaces.

## Status

> 🔧 This project is under active development.  
> 🧪 The prediction feature is a **prototype** and should not be used for critical decisions.  
> 📊 Core functionality focuses on sample tracking and parameter analysis.
