# Scientific & Technical Limitations
**ARES // Astronaut Route & Exploration System**  
*NASA Space Apps Challenge 2026 — Interplanetary Survival Guide: Martian Map*

---

## 1. Cartographic & Spatial Resolution Limits
- **Orbital Sensor Threshold:** Global planetary datasets (such as the Viking MDIM 2.1 color mosaic at 232 m/pixel and MOLA shaded relief at 463 m/pixel) provide excellent regional morphology and macro-topographic context, but cannot resolve human-scale obstacles.
- **Unresolved Surface Hazards:** Sub-meter boulders, micro-fissures, inverted river channel cobbles, and sharp ventifacts cannot be detected from coarse orbital elevation rasters.
- **Micro-Scale Roughness:** Even within high-resolution regional DTM grids (e.g. 350m calibrated Jezero DEM), local surface roughness indices represent statistical approximations derived from orbital radar and optical shadows.

---

## 2. Terrain & Slope Analysis Uncertainty
- **Numerical Slope Formulation:** Slopes in ARES are computed using finite difference gradients:
  $$\theta = \tan^{-1}\left(\sqrt{\left(\frac{\partial z}{\partial x}\right)^2 + \left(\frac{\partial z}{\partial y}\right)^2}\right)$$
- **Slope Aggregation Smoothing:** Elevation grids average vertical relief across the cell area. A cell with an average slope of 8° can contain localized vertical 2-meter drop-offs or sheer rock scarps.
- **Handling of Missing Data:** ARES enforces a strict policy: **missing elevation or slope data is NEVER treated as zero hazard**. Incomplete survey cells receive uncertainty penalties $w_u \cdot U(e)$ in the A* pathfinding graph.

---

## 3. Environmental & Meteorological Telemetry
- **Point Measurements:** Weather records from Curiosity (Gale Crater REMS), Perseverance (Jezero Crater MEDA), and InSight (Elysium Planitia TWINS) represent point-source in-situ measurements taken on the crater floor.
- **Crater Microclimates:** Gale Crater and Jezero Crater feature deep basin topographies that produce local thermal inversions, katabatic winds, and boundary layer behaviors that are not representative of Martian highlands, volcanic plateaus, or polar plains.
- **Temporal Freshness:** InSight telemetry concluded in December 2022. All environmental telemetry is archived science data and must not be interpreted as a live real-time forecast.

---

## 4. Human Factors & Extravehicular Activity (EVA) Assumptions
- **Locomotion Speed:** The default walking speed ($0.5\text{ km/h}$) is an idealized average derived from Apollo lunar EVAs and the NASA Human Integration Design Handbook (HIDH). Real astronaut traverse speeds vary widely depending on suit pressurization fatigue, regolith sinking, equipment mass, and incline angle.
- **Life Support Consumables:** Nominal NASA EVA suits (e.g. xEMU) carry consumable envelopes for approximately 8 hours of life support ($O_2$, $CO_2$ scrubbing, cooling water, and battery power). Traverses exceeding 6 hours are flagged with critical duration warnings.
- **Line-of-Sight & Communications:** Traverses descending into canyon breaches or around mesa shadows (such as Kodiak Butte) may experience UHF/direct-to-habitat communication blackouts.

---

## 5. Non-Certification Disclaimer
> **IMPORTANT NOTICE:**  
> ARES is a research, educational, and mission-planning simulation prototype built for the NASA Space Apps Challenge 2026.  
> It is **NOT certified by NASA or any space agency as operational astronaut navigation software or life-critical survival directives**. Traverses must be validated through robotic reconnaissance scouts and rigorous human-in-the-loop flight control operations.
