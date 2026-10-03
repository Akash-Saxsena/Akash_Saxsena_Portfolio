/* Akash Saxsena — portfolio interactions */
(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============================================================
     Boot screen
     ============================================================ */
  const bootScreen = $("#bootScreen");
  const bootName = $("#bootName");

  if (bootScreen && bootName) {
    const name = "AKASH SAXSENA";
    if (reducedMotion) {
      bootName.textContent = name;
      bootScreen.classList.add("is-hidden");
    } else {
      name.split("").forEach((letter, index) => {
        const span = document.createElement("span");
        span.className = letter === " " ? "boot-space" : "boot-letter";
        span.textContent = letter === " " ? "" : letter;
        span.style.animationDelay = `${index * 75}ms`;
        bootName.appendChild(span);
      });

      let hidden = false;
      const finish = () => {
        if (hidden) return;
        hidden = true;
        bootScreen.classList.add("is-hidden");
      };
      window.addEventListener("load", () => window.setTimeout(finish, 3300));
      window.setTimeout(finish, 5200);
      bootScreen.addEventListener("click", finish);
    }
  }

  /* Optional decorative grid on the boot canvas */
  const bootCanvas = $("#bootCanvas");
  if (bootCanvas && !reducedMotion) {
    const bootCtx = bootCanvas.getContext("2d");
    if (bootCtx) {
      let bootFrame = 0;
      let bootTime = 0;
      const sizeBoot = () => {
        bootCanvas.width = bootCanvas.clientWidth || window.innerWidth;
        bootCanvas.height = bootCanvas.clientHeight || window.innerHeight;
      };
      const drawBoot = () => {
        const w = bootCanvas.width;
        const h = bootCanvas.height;
        bootCtx.clearRect(0, 0, w, h);
        const gap = 46;
        const offset = (bootTime * 0.55) % gap;
        bootCtx.strokeStyle = "rgba(62, 215, 187, 0.10)";
        bootCtx.lineWidth = 1;
        for (let x = -offset; x < w; x += gap) {
          bootCtx.beginPath(); bootCtx.moveTo(x, 0); bootCtx.lineTo(x, h); bootCtx.stroke();
        }
        for (let y = -offset; y < h; y += gap) {
          bootCtx.beginPath(); bootCtx.moveTo(0, y); bootCtx.lineTo(w, y); bootCtx.stroke();
        }
        bootCtx.strokeStyle = "rgba(62, 215, 187, 0.30)";
        bootCtx.beginPath();
        const cy = h * 0.5 + Math.sin(bootTime * 0.02) * 42;
        bootCtx.moveTo(0, cy); bootCtx.lineTo(w, cy); bootCtx.stroke();
        bootTime += 1;
        bootFrame = window.requestAnimationFrame(drawBoot);
      };
      sizeBoot();
      drawBoot();
      window.addEventListener("resize", sizeBoot);
      if (bootScreen) {
        const bootObserver = new MutationObserver(() => {
          if (bootScreen.classList.contains("is-hidden")) {
            window.cancelAnimationFrame(bootFrame);
            bootObserver.disconnect();
          }
        });
        bootObserver.observe(bootScreen, { attributes: true, attributeFilter: ["class"] });
      }
    }
  }

  /* ============================================================
     Animated circuit background canvas
     ============================================================ */
  const waveCanvas = $("#waveCanvas");
  if (waveCanvas) {
    const waveContext = waveCanvas.getContext("2d");
    if (waveContext) {
      const field = { width: 0, height: 0, scale: 1, time: 0 };

      const resizeWaveCanvas = () => {
        field.width = window.innerWidth;
        field.height = window.innerHeight;
        field.scale = Math.min(window.devicePixelRatio || 1, 2);
        waveCanvas.width = field.width * field.scale;
        waveCanvas.height = field.height * field.scale;
        waveContext.setTransform(field.scale, 0, 0, field.scale, 0, 0);
      };

      const drawWaveField = () => {
        const { width, height } = field;
        waveContext.clearRect(0, 0, width, height);
        const time = field.time * 0.001;
        const horizon = height * 0.48;
        const vanishingX = width * 0.5;

        waveContext.lineWidth = 1;
        for (let line = -12; line <= 12; line += 1) {
          const edgeX = vanishingX + line * width * 0.12;
          waveContext.beginPath();
          waveContext.moveTo(vanishingX, horizon);
          waveContext.lineTo(edgeX, height);
          waveContext.strokeStyle = "rgba(63, 170, 157, .16)";
          waveContext.stroke();
        }

        for (let row = 0; row < 15; row += 1) {
          const depth = row / 15;
          const y = horizon + Math.pow(depth, 1.7) * height * 0.6;
          waveContext.beginPath();
          waveContext.moveTo(0, y);
          waveContext.lineTo(width, y);
          waveContext.strokeStyle = `rgba(63, 170, 157, ${0.08 + depth * 0.08})`;
          waveContext.stroke();
        }

        for (let particle = 0; particle < 110; particle += 1) {
          const seed = (particle * 47) % 101;
          const depth = (seed / 101 + time * 0.018) % 1;
          const spread = ((particle * 83) % 100) / 100 - 0.5;
          const x = vanishingX + spread * width * (0.3 + depth * 1.5);
          const y = horizon + depth * height * 0.58 + Math.sin(time * 1.5 + particle) * 3;
          const glow = (Math.sin(time * 2 + particle) + 1) / 2;
          const radius = 0.7 + depth * 2.8;
          waveContext.beginPath();
          waveContext.fillStyle = `rgba(${65 + Math.round(glow * 30)}, ${180 + Math.round(glow * 60)}, ${165 + Math.round(glow * 40)}, ${0.16 + depth * 0.55})`;
          waveContext.shadowColor = "#43cdb2";
          waveContext.shadowBlur = depth > 0.7 ? 9 : 3;
          waveContext.arc(x, y, radius, 0, Math.PI * 2);
          waveContext.fill();
          waveContext.shadowBlur = 0;
        }
      };

      const animateWaveField = timestamp => {
        field.time = timestamp;
        drawWaveField();
        if (!reducedMotion) window.requestAnimationFrame(animateWaveField);
      };

      resizeWaveCanvas();
      window.addEventListener("resize", resizeWaveCanvas);
      window.requestAnimationFrame(animateWaveField);
    }
  }

  /* ============================================================
     Navigation, back-to-top, footer year, active link
     ============================================================ */
  const menuToggle = $("#menuToggle");
  const navLinks = $("#navLinks");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
    $$(".nav-links a").forEach(link => {
      link.addEventListener("click", () => navLinks.classList.remove("open"));
    });
  }

  const topBtn = $("#topBtn");
  if (topBtn) {
    const onScroll = () => topBtn.classList.toggle("show", window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    topBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    });
  }

  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  const sectionLinks = $$('.nav-links a[href^="#"]');
  const sections = sectionLinks
    .map(link => document.getElementById(link.getAttribute("href").slice(1)))
    .filter(Boolean);
  if (sections.length && "IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(section => navObserver.observe(section));
  }

  /* ============================================================
     Reveal-on-scroll
     ============================================================ */
  const revealEls = $$(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("visible"));
  }

  /* ============================================================
     Modal helpers (shared by skill / project / cert / eduspark)
     ============================================================ */
  const setText = (selector, value) => {
    const el = $(selector);
    if (el) el.textContent = value;
  };
  const fillList = (selector, items) => {
    const el = $(selector);
    if (!el) return;
    el.innerHTML = "";
    items.forEach(item => {
      const row = document.createElement("div");
      row.textContent = item;
      el.appendChild(row);
    });
  };
  const fillSpecs = (selector, specs) => {
    const el = $(selector);
    if (!el) return;
    el.innerHTML = "";
    specs.forEach(spec => {
      const box = document.createElement("div");
      box.className = "spec";
      const strong = document.createElement("b");
      strong.textContent = spec.value;
      const label = document.createElement("span");
      label.textContent = spec.label;
      box.appendChild(strong);
      box.appendChild(label);
      el.appendChild(box);
    });
  };

  const openModal = modal => {
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const closeBtn = modal.querySelector(".modal-close-btn");
    if (closeBtn) closeBtn.focus();
  };
  const closeModal = modal => {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    if (!$$('.project-modal-backdrop.is-open').length) document.body.style.overflow = "";
  };

  $$(".project-modal-backdrop").forEach(backdrop => {
    backdrop.addEventListener("click", event => {
      if (event.target === backdrop) closeModal(backdrop);
    });
    const closeBtn = backdrop.querySelector(".modal-close-btn");
    if (closeBtn) closeBtn.addEventListener("click", () => closeModal(backdrop));
  });
  $$("#modalDismissBtn, #certModalDismissBtn, #skillModalDismissBtn, #edusparkModalDismissBtn").forEach(btn => {
    btn.addEventListener("click", () => closeModal(btn.closest(".project-modal-backdrop")));
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") $$(".project-modal-backdrop.is-open").forEach(closeModal);
  });

  /* ============================================================
     Orbit skills system
     ============================================================ */
  const orbitStage = $("#orbitCanvasStage");
  const orbitNodes = $$(".orbit-node");
  const hubDefault = $("#hubDefault");
  const hubActive = $("#hubActive");
  const hubInspectBtn = $("#hubInspectBtn");
  const hubResetBtn = $("#hubResetBtn");
  const orbitPills = $$(".orbit-pill");
  const mobileChipsWrap = $("#orbitMobileChips");
  let activeSkill = null;

  const showDefaultHub = () => {
    activeSkill = null;
    if (hubDefault) hubDefault.style.display = "";
    if (hubActive) hubActive.style.display = "none";
    orbitNodes.forEach(node => node.classList.remove("is-active"));
  };

  const selectSkill = node => {
    activeSkill = node;
    orbitNodes.forEach(item => item.classList.toggle("is-active", item === node));
    if (hubDefault) hubDefault.style.display = "none";
    if (hubActive) {
      hubActive.style.display = "";
      setText("#hubActiveCat", (node.dataset.cat || "").toUpperCase());
      setText("#hubActiveName", node.dataset.name || "");
      setText("#hubActiveSub", node.dataset.sub || "");
    }
  };

  const layoutOrbit = () => {
    if (!orbitStage) return;
    const container = orbitStage.parentElement;
    if (!container) return;
    if (window.getComputedStyle(orbitStage).display === "none") {
      container.style.height = "";
      return;
    }
    const scale = Math.min(1, container.clientWidth / 1024);
    orbitStage.style.setProperty("--orbit-scale", String(scale));
    container.style.height = `${Math.round(920 * scale)}px`;
  };

  if (orbitNodes.length) {
    orbitNodes.forEach(node => {
      node.setAttribute("role", "button");
      node.setAttribute("tabindex", "0");
      node.setAttribute("aria-label", `${node.dataset.name} — ${node.dataset.cat}`);
      node.addEventListener("click", () => selectSkill(node));
      node.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectSkill(node);
        }
      });
    });
    if (hubResetBtn) hubResetBtn.addEventListener("click", showDefaultHub);
    if (hubInspectBtn) {
      hubInspectBtn.addEventListener("click", () => {
        if (activeSkill) openSkillModal(activeSkill);
      });
    }
  }

  if (mobileChipsWrap && orbitNodes.length) {
    orbitNodes.forEach(node => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "orbit-chip";
      chip.dataset.cat = node.dataset.cat || "";
      chip.style.setProperty("--chip-accent", node.dataset.color || "#25d2db");
      const dot = document.createElement("i");
      chip.appendChild(dot);
      chip.appendChild(document.createTextNode(node.dataset.name || ""));
      chip.addEventListener("click", () => openSkillModal(node));
      mobileChipsWrap.appendChild(chip);
    });
  }

  const applyOrbitFilter = filter => {
    orbitNodes.forEach(node => {
      node.classList.toggle("filtered-out", filter !== "all" && node.dataset.cat !== filter);
    });
    $$(".orbit-chip").forEach(chip => {
      chip.classList.toggle("filtered-out", filter !== "all" && chip.dataset.cat !== filter);
    });
    if (activeSkill && activeSkill.classList.contains("filtered-out")) showDefaultHub();
  };

  orbitPills.forEach(pill => {
    pill.addEventListener("click", () => {
      orbitPills.forEach(item => item.classList.toggle("active", item === pill));
      applyOrbitFilter(pill.dataset.filter || "all");
    });
  });

  layoutOrbit();
  window.addEventListener("resize", layoutOrbit);

  const SKILL_META = {
    Embedded: { modules: ["CPU core & clock tree", "GPIO / timers / interrupts", "Peripheral bus (I2C / SPI / UART)", "Power & reset circuitry"], apps: ["Firmware bring-up", "Real-time sensor control", "Low-power embedded builds"], standard: "Deterministic timing & resource budgets" },
    Hardware: { modules: ["Component selection", "Schematic capture", "Power supply design", "Signal integrity checks"], apps: ["Prototype assembly", "Bench validation", "Production hand-off"], standard: "DFM-ready hardware validation" },
    Protocols: { modules: ["Physical layer", "Frame / packet format", "Timing & clocking", "Error handling"], apps: ["Peripheral integration", "Device-to-cloud transport", "Industrial networking"], standard: "Spec-compliant serial communication" },
    "Design Tools": { modules: ["Schematic editor", "Footprint & library management", "Routing & design rules", "Gerber / fabrication output"], apps: ["Schematic-to-PCB workflow", "Panel layout planning", "Manufacturing exports"], standard: "Clean DRC / ERC pass" },
    Programming: { modules: ["Language core", "Data structures", "Toolchain & compiler", "Version control"], apps: ["Firmware & tooling", "Automation scripts", "Hardware-software glue"], standard: "Readable, tested source" },
    IoT: { modules: ["Edge device", "Connectivity stack", "Cloud endpoint", "Security & provisioning"], apps: ["Remote telemetry", "Cloud dashboards", "Over-the-air updates"], standard: "Reliable connected systems" }
  };

  const skillModal = $("#skillModal");
  const openSkillModal = node => {
    if (!skillModal || !node) return;
    const category = node.dataset.cat || "Engineering";
    const meta = SKILL_META[category] || { modules: ["Core concepts", "Practical usage", "Debug & validation"], apps: ["Project delivery", "Hardware integration", "Documentation"], standard: "Validated in lab" };
    const name = node.dataset.name || "";
    const sub = node.dataset.sub || "";
    setText("#skillModalCategory", `${category.toUpperCase()} // ENGINEERING CORE`);
    setText("#skillModalTitle", name);
    setText("#skillModalTagline", `${sub} • ${category} discipline`);
    setText("#skillModalDiagram", `  [ HOST / MCU ]\n        |\n     ${name}\n        |\n   ${category} domain\n        |\n   +--- ${sub}\n        |\n   [ validated workflow ]\n`);
    fillList("#skillModalModules", meta.modules);
    fillList("#skillModalApps", meta.apps);
    fillSpecs("#skillModalSpecs", [
      { value: name, label: "Technology" },
      { value: category, label: "Discipline" },
      { value: "PROFICIENT", label: meta.standard }
    ]);
    openModal(skillModal);
  };

  /* ============================================================
     Waveform showcases (horizontal track + nav + progress)
     ============================================================ */
  const setupWaveform = (viewportSel, prevSel, nextSel, fillSel) => {
    const viewport = $(viewportSel);
    if (!viewport) return;
    const prev = $(prevSel);
    const next = $(nextSel);
    const fill = $(fillSel);
    const step = 460;
    const update = () => {
      const max = viewport.scrollWidth - viewport.clientWidth;
      const progress = max > 0 ? viewport.scrollLeft / max : 0;
      if (fill) fill.style.width = `${Math.min(100, Math.max(0, progress * 100))}%`;
      if (prev) prev.disabled = viewport.scrollLeft <= 2;
      if (next) next.disabled = viewport.scrollLeft >= max - 2;
    };
    viewport.addEventListener("scroll", update, { passive: true });
    if (prev) prev.addEventListener("click", () => viewport.scrollBy({ left: -step, behavior: reducedMotion ? "auto" : "smooth" }));
    if (next) next.addEventListener("click", () => viewport.scrollBy({ left: step, behavior: reducedMotion ? "auto" : "smooth" }));
    window.addEventListener("resize", update);
    update();
  };
  setupWaveform("#waveViewport", "#wavePrevBtn", "#waveNextBtn", "#indicatorLineFill");
  setupWaveform("#certWaveViewport", "#certWavePrevBtn", "#certWaveNextBtn", "#certIndicatorLineFill");

  /* ============================================================
     Project telemetry modal content
     ============================================================ */
  const PROJECT_DATA = {
    "1": {
      code: "TP1 // PHASE 01",
      title: "Smart EV Charging",
      tagline: "IoT Load Management & RFID Billing",
      diagram: "[ RFID CARD ] --SPI--> [ MFRC522 ]\n                            |\n                            v\n                     [ ESP8266 NodeMCU ]\n                      |    |      |    |\n          ACS712 <----+    |      |    +----> 16x2 I2C LCD\n       (current)          |      |\n                       DS3231   30A Relay\n                        (RTC)   (charging port)\n                            |\n                            v\n                   [ Embedded HTTP Server ]",
      pinout: ["ESP8266 NodeMCU — main controller (Wi-Fi + HTTP server)", "MFRC522 RFID reader — SPI bus", "ACS712 hall current sensor — analog input", "DS3231 RTC — I2C timekeeping", "16x2 LCD (I2C) — local status display", "30A relay module — charging port switching"],
      firmware: ["Boot Wi-Fi stack + embedded HTTP server", "Read RFID UID and authenticate the user", "Sample ACS712 and compute RMS current", "Timestamp and log every charging session", "Trip relay on overcurrent / unauthorised access"],
      specs: [{ value: "230V", label: "AC mains handled" }, { value: "30A", label: "Relay switching" }, { value: "13.56MHz", label: "RFID authentication" }, { value: "ESP8266", label: "Wi-Fi SoC" }]
    },
    "2": {
      code: "TP2 // PHASE 02",
      title: "Mecanum RC Car",
      tagline: "Omni-Directional Robotics Controller",
      diagram: "[ RC / BLE INPUT ]\n        |\n        v\n   [ ESP32 Controller ]\n        |\n   +----+----+----+\n   |    |    |    |\n L298N L298N FL   FR\n  left  right  wheels\n        |\n   [ kinematics solver ]",
      pinout: ["ESP32 — main controller (BLE + UDP)", "Dual L298N drivers — 4-wheel H-bridges", "LEDC PWM channels — independent wheel speed", "18650 battery pack — motor supply", "Onboard IMU — heading feedback (optional)"],
      firmware: ["Parse wireless drive commands", "Run mecanum inverse kinematics", "Set per-wheel LEDC PWM duty", "Ramp speed to avoid current spikes", "Fail-safe stop on signal loss"],
      specs: [{ value: "3-DOF", label: "Omni-directional motion" }, { value: "4×", label: "Independent PWM wheels" }, { value: "BLE/UDP", label: "Control link" }, { value: "ESP32", label: "Dual-core SoC" }]
    },
    "3": {
      code: "TP3 // PHASE 03",
      title: "Radar System",
      tagline: "Ultrasonic Proximity & GUI Sweep",
      diagram: "[ SG90 SERVO ] --PWM--> 180deg sweep\n        |\n   [ HC-SR04 ] --echo--> [ Arduino ]\n                              |\n                          UART serial\n                              |\n                              v\n                   [ Processing GUI ]\n                    polar radar sweep",
      pinout: ["Arduino UNO — sweep controller", "HC-SR04 ultrasonic sensor — echo / trigger", "SG90 servo — 180° azimuth sweep", "Timer1 — servo PWM generation", "USB UART — telemetry to Processing GUI"],
      firmware: ["Sweep servo across 180° in fixed steps", "Trigger ultrasonic burst and read echo time", "Convert echo time to distance", "Stream angle + distance over UART", "Draw polar sweep in the Processing GUI"],
      specs: [{ value: "180°", label: "Scan field" }, { value: "2cm–4m", label: "Detection range" }, { value: "50Hz", label: "Sweep update" }, { value: "Arduino", label: "MCU platform" }]
    },
    "4": {
      code: "TP4 // PHASE 04",
      title: "Smart Gadget & IoT",
      tagline: "Alcohol Interlock & Home Automation",
      diagram: "[ MQ-3 SENSOR ] --analog--> [ NodeMCU ]\n                                  |\n                          +-------+--------+\n                          |                |\n                   [ Ignition         [ 4-ch Relay ]\n                     Interlock ]       Home loads\n                          |                |\n                          +---- Blynk IoT ---+",
      pinout: ["NodeMCU ESP8266 — controller + Wi-Fi", "MQ-3 alcohol sensor — analog breath input", "4-channel relay module — appliance control", "Ignition relay — safety interlock", "Blynk IoT — cloud dashboard + control"],
      firmware: ["Read and baseline MQ-3 analog output", "Block ignition when threshold is exceeded", "Publish sensor state to Blynk cloud", "Handle remote relay toggle commands", "Alert on unsafe breath-alcohol levels"],
      specs: [{ value: "4-ch", label: "Relay automation" }, { value: "MQ-3", label: "Gas sensing" }, { value: "Blynk", label: "Cloud control" }, { value: "NodeMCU", label: "Wi-Fi controller" }]
    },
    "5": {
      code: "TP5 // PHASE 05 // FEATURED",
      title: "Smart Car Parking",
      tagline: "IoT RFID Access & Slot Management",
      diagram: "[ RFID TAG ] --> [ MFRC522 ] --SPI--> [ ESP8266 ]\n                                            |\n              [ IR SLOT SENSORS ] ---------> |\n                                            |\n                          +-----------------+-----------------+\n                          |                 |                 |\n                    [ 16x2 LCD ]      [ Buzzer ]     [ Web Dashboard ]\n                    slot + UID        alerts        REST API + LittleFS",
      pinout: ["ESP8266 NodeMCU — controller + web server", "MFRC522 RFID — SPI vehicle authentication", "IR sensors — slot occupancy detection", "16x2 LCD (I2C) — slot and UID display", "Buzzer — access granted / denied alert", "LittleFS — stored vehicle records"],
      firmware: ["Authenticate vehicle by RFID UID", "Allocate the first free slot automatically", "Monitor IR sensors for occupancy", "Serve dashboard via REST API + LittleFS", "Alert and deny access for unknown tags"],
      specs: [{ value: "RFID", label: "Vehicle auth" }, { value: "IR", label: "Slot monitoring" }, { value: "REST", label: "Web dashboard" }, { value: "ESP8266", label: "Wi-Fi SoC" }]
    }
  };

  const projectModal = $("#projectModal");
  const openProjectModal = key => {
    const data = PROJECT_DATA[String(key)];
    if (!projectModal || !data) return;
    setText("#modalTp", data.code);
    setText("#modalTitle", data.title);
    setText("#modalTagline", data.tagline);
    setText("#modalDiagram", data.diagram);
    fillList("#modalPinout", data.pinout);
    fillList("#modalFirmware", data.firmware);
    fillSpecs("#modalSpecs", data.specs);
    openModal(projectModal);
  };
  $$(".project-inspect-btn[data-inspect]").forEach(btn => {
    btn.addEventListener("click", () => openProjectModal(btn.dataset.inspect));
  });

  /* ============================================================
     Certification verification modal content
     ============================================================ */
  const CERT_DATA = {
    "1": {
      code: "CERT 01 // LERNX",
      title: "Project Management",
      tagline: "Agile, Scrum & Resource Planning",
      diagram: "[ INITIATE ] -> [ PLAN ] -> [ EXECUTE ]\n     |             |           |\n  charter      scope/WBS    sprints\n     |             |           |\n     +-------> [ MONITOR ] <---+\n                   |\n              [ CLOSE-OUT ]",
      skills: ["Agile methodology", "Scrum framework", "Resource planning", "Budgeting", "Risk mitigation"],
      application: ["Sprint planning for hardware R&D", "BOM and component budgeting", "Milestone tracking for prototypes"],
      specs: [{ value: "ab8lmapldri", label: "Credential ID" }, { value: "Lernx", label: "Issuing authority" }, { value: "VERIFIED", label: "Assessment status" }, { value: "Agile", label: "Core framework" }]
    },
    "2": {
      code: "CERT 02 // LERNX",
      title: "Python Programming",
      tagline: "Object-Oriented Programming & Data Handling",
      diagram: "[ SYNTAX & TYPES ]\n        |\n   [ FUNCTIONS ]\n        |\n   [ OOP / CLASSES ]\n        |\n   [ DATA STRUCTURES ]\n        |\n   [ ANALYSIS & SCRAPING ]",
      skills: ["Python syntax", "Object-oriented design", "Data structures", "Data scrapers", "Data analysis"],
      application: ["Image conversion utilities for embedded assets", "Serial data parsing from MCU boards", "Automation of repetitive test workflows"],
      specs: [{ value: "python-gaof80f89w8", label: "Credential ID" }, { value: "Lernx", label: "Issuing authority" }, { value: "VERIFIED", label: "Assessment status" }, { value: "OOP", label: "Core competency" }]
    },
    "3": {
      code: "CERT 03 // LERNX",
      title: "MS Excel Mastery",
      tagline: "Advanced Formulas, Pivots & Dashboards",
      diagram: "[ RAW DATA ]\n      |\n [ FORMULAS & LOOKUPS ]\n      |\n [ PIVOT TABLES ]\n      |\n [ DASHBOARDS & CHARTS ]\n      |\n [ DECISIONS ]",
      skills: ["Advanced formulas", "Pivot tables", "Data visualisation", "Dashboard design", "Business reporting"],
      application: ["Component inventory and stock sheets", "Project progress and cost trackers", "Test-result trend dashboards"],
      specs: [{ value: "iuoftahh28", label: "Credential ID" }, { value: "Lernx", label: "Issuing authority" }, { value: "VERIFIED", label: "Assessment status" }, { value: "Excel", label: "Core tool" }]
    }
  };

  const certModal = $("#certModal");
  const openCertModal = key => {
    const data = CERT_DATA[String(key)];
    if (!certModal || !data) return;
    setText("#certModalTp", data.code);
    setText("#certModalTitle", data.title);
    setText("#certModalTagline", data.tagline);
    setText("#certModalDiagram", data.diagram);
    fillList("#certModalSkills", data.skills);
    fillList("#certModalApplication", data.application);
    fillSpecs("#certModalSpecs", data.specs);
    openModal(certModal);
  };
  $$(".cert-inspect-btn[data-cert-inspect]").forEach(btn => {
    btn.addEventListener("click", () => openCertModal(btn.dataset.certInspect));
  });

  /* ============================================================
     EduSpark Classes modal
     ============================================================ */
  const edusparkModal = $("#edusparkLightboxModal");
  ["#openEduSparkModalBtn", "#viewBannerBtn"].forEach(selector => {
    const btn = $(selector);
    if (btn) btn.addEventListener("click", () => openModal(edusparkModal));
  });
  const bannerCard = $("#bannerCardPreview");
  if (bannerCard) {
    bannerCard.addEventListener("click", () => openModal(edusparkModal));
    bannerCard.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal(edusparkModal);
      }
    });
  }

  /* ============================================================
     Contact form — opens the visitor's mail client
     ============================================================ */
  const contactForm = $("#contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", event => {
      event.preventDefault();
      const nameField = $("#name");
      const emailField = $("#email");
      const subjectField = $("#subject");
      const messageField = $("#message");
      const name = nameField ? nameField.value.trim() : "";
      const email = emailField ? emailField.value.trim() : "";
      const subject = subjectField ? subjectField.value.trim() : "";
      const message = messageField ? messageField.value.trim() : "";
      const body =
        `Hello Akash,%0D%0A%0D%0A` +
        `Name: ${encodeURIComponent(name)}%0D%0A` +
        `Email: ${encodeURIComponent(email)}%0D%0A%0D%0A` +
        `${encodeURIComponent(message)}`;
      window.location.href =
        `mailto:akashsaxsena1@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    });
  }
})();
