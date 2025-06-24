# BluElephant Water Analyzer

**BluElephant Water Analyzer** — a web-based tool supporting the **BluElephant** decentralized wastewater treatment system by enabling intuitive tracking and analysis of water sample data.

> Developed as part of the **European Project Semester (EPS)** at Saxion University, this app contributes to improving the usability and performance of the experimental **BluElephant** solution: [bluelephant.global](https://www.bluelephant.global/)

## What does this app do?

This application helps you store, organize, and analyze measurements from water samples collected at various stages of the treatment process — including **influent**, **effluent**, and **sludge**.

It allows you to explore historical trends in selected parameters, compare sample types, and export data for external analysis. The app also includes a prototype **prediction feature** that flags samples potentially exceeding legal limits, based on an early-stage machine learning model.

## Key Features

- **Sample management** for multiple categories: influent, effluent, and sludge.  
- **Dynamic parameter analysis** with visual charts and filters.  
- **Data export** to Excel or CSV for offline work or reporting.  
- **Prototype prediction module** using a Random Forest model to detect potential legal threshold exceedance.  
- **JWT-secured login** supporting multiple user accounts.  
- **Measurements view** to review and analyze past samples with optional legal limit overlays.  

## Technologies Used

- **Backend:** [FastAPI](https://fastapi.tiangolo.com) — a high-performance Python web framework.  
- **Database:** [PostgreSQL](https://www.postgresql.org/) — robust and scalable relational database.  
- **Machine Learning:** Random Forest Classifier (prototype feature).  
- **Frontend:** [React](https://react.dev) + [Tailwind CSS](https://tailwindcss.com) — for a responsive and consistent UI.  


> The prediction feature is a **prototype** and should not be used for critical decisions.  
> Core functionality focuses on sample tracking, user access, and parameter analysis.
