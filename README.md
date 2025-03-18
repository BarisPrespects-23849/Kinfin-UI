# KinFin UI

![KinFin UI Banner](/placeholder.svg?height=300&width=800)

## A Modern Web Interface for Protein Clustering Analysis

KinFin UI is a comprehensive web application for analyzing and visualizing protein clustering data. It provides researchers with interactive tools to explore relationships between protein clusters, taxonomic groups, and species distributions, making complex bioinformatics data more accessible and interpretable.

[![Next.js](https://img.shields.io/badge/built%20with-Next.js-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue)](https://www.typescriptlang.org/)
[![D3.js](https://img.shields.io/badge/D3.js-orange)](https://d3js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC)](https://tailwindcss.com/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Screenshots](#-screenshots)
- [Installation and Setup](#-installation-and-setup)
- [Usage](#-usage)
- [Code Structure and Architecture](#-code-structure-and-architecture)
- [Dependencies](#-dependencies)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## ✨ Features

KinFin UI offers a suite of powerful features designed to help researchers analyze protein clustering data effectively:

### Interactive Dashboard

The dashboard provides a comprehensive overview of your protein clustering data with key metrics and visualizations.

- **Summary Statistics**: View essential metrics like total clusters, proteins, species, and more at a glance.
- **Distribution Charts**: Explore cluster size distribution, species distribution, and taxonomic group distribution through interactive charts.
- **Recent Clusters**: Quick access to recently analyzed clusters for continued work.
- **Data Export**: Export dashboard data in various formats (JSON, CSV, TXT) for further analysis in other tools.

**Technical Details**: The dashboard uses Recharts for responsive, interactive visualizations and implements a tab-based interface to organize different data views efficiently.

### Cluster Analysis

Dive deep into your protein clusters with comprehensive analysis tools.

- **Filterable Table**: Browse, sort, and filter all protein clusters with a powerful data table.
- **Detailed Cluster View**: Examine individual clusters with information on proteins, species distribution, and domain architecture.
- **Cluster Comparison**: Compare multiple clusters side-by-side with visualizations of their overlap and differences.
- **Statistical Analysis**: Analyze cluster statistics with advanced visualizations like scatter plots and heatmaps.

**Example Use Case**: A researcher can filter clusters by taxonomic group (e.g., "Bacteria"), sort by conservation score, and then select specific clusters for detailed comparison to identify evolutionary patterns.

### Taxonomy Visualization

Explore taxonomic relationships with three different interactive visualizations.

- **Treemap**: Hierarchical visualization showing the relative sizes of taxonomic groups.
- **Hierarchy Tree**: Traditional tree visualization of taxonomic relationships.
- **Sunburst Chart**: Radial visualization showing taxonomic hierarchy from center outward.

**Technical Details**: These visualizations use D3.js for complex, interactive data representations. Each visualization supports zooming, panning, and tooltips for detailed information. The treemap and hierarchy visualizations include special text rendering techniques to ensure readability against varying backgrounds.

### Network Graph

Visualize relationships between protein clusters with an interactive force-directed graph.

- **Interactive Nodes**: Nodes represent clusters, with size indicating cluster size and color indicating taxonomic group.
- **Relationship Links**: Links between nodes show relationships, with thickness indicating relationship strength.
- **Adjustable Parameters**: Control link strength, simulation physics, and zoom level with intuitive controls.
- **Node Details**: Hover over nodes to see detailed information and highlight connected clusters.

**Technical Details**: The network graph uses D3.js force simulation with customizable parameters. It implements gradient-colored links, interactive tooltips, and optimized rendering for both desktop and mobile devices.

### Responsive Design

KinFin UI is fully responsive and works seamlessly across devices of all sizes.

- **Mobile-Optimized Interface**: Tailored layouts and controls for small screens.
- **Touch-Friendly Interactions**: Optimized for touch devices with appropriate gesture support.
- **Adaptive Visualizations**: Visualizations adjust their complexity and interaction models based on device capabilities.
- **Consistent Experience**: Core functionality remains accessible regardless of device.

**Technical Details**: The application uses the `useMobile` hook to detect device capabilities and Tailwind CSS for responsive layouts. Visualizations implement device-specific optimizations for performance and usability.

### Theme Support

KinFin UI supports both light and dark themes for comfortable viewing in any environment.

- **System Preference Detection**: Automatically matches your system's theme preference.
- **Manual Toggle**: Easily switch between light and dark themes with a toggle button.
- **Consistent Styling**: All components and visualizations adapt to the current theme.

**Technical Details**: Theme support is implemented using the `next-themes` library with CSS variables for consistent color application throughout the application.

### Command Menu

Navigate the application quickly with a keyboard-accessible command menu.

- **Keyboard Shortcut**: Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux) to open the command menu.
- **Quick Navigation**: Jump to any section of the application with a few keystrokes.
- **Action Execution**: Perform common actions directly from the command menu.

**Technical Details**: The command menu is built using the CMDK library and is fully keyboard accessible, supporting arrow navigation, selection, and search filtering.

---

## 📸 Screenshots

### Dashboard
![Dashboard](https://github.com/BarisPrespects-23849/Kinfin-UI/blob/main/Dashboard.png?raw=true)
*The main dashboard showing summary statistics and distribution charts*

### Cluster Analysis
![Cluster Analysis](https://github.com/BarisPrespects-23849/Kinfin-UI/blob/main/Cluster.png?raw=true)
*Detailed view of protein clusters with filtering and sorting capabilities*

### Taxonomy Visualization
![Taxonomy Visualization]([https://github.com/BarisPrespects-23849/Kinfin-UI/blob/main/map.png?raw=true](https://github.com/BarisPrespects-23849/Kinfin-UI/blob/main/map.png?raw=true))
*Interactive treemap visualization of taxonomic relationships*

### Network Graph
![Network Graph](https://github.com/BarisPrespects-23849/Kinfin-UI/blob/main/Network.png?raw=true)
*Force-directed graph showing relationships between protein clusters*

---

## 🚀 Installation and Setup

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- Git

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/kinfin-ui.git
   cd kinfin-ui

