// src/data/collectionsData.js

export const DEFAULT_COLLECTIONS = [
  {
    id: "col_easter",
    title: "Easter & Resurrection",
    title_twi: "Kwesida Akyi & Wusɔreɛ",
    description: "Hymns celebrating the triumph of Christ over death, Easter Sunday, and the Resurrection season.",
    season: "Easter",
    color: "#b8860b",
    icon: "SparkleIcon",
    hymn_numbers: [142, 143, 144, 145, 146, 147, 148, 150]
  },
  {
    id: "col_lent",
    title: "Lent, Passion & The Cross",
    title_twi: "Mmuadadi & Awerɛho Mmerɛ",
    description: "Penitential hymns, the Passion of Christ, suffering on the Cross, and self-examination.",
    season: "Lent",
    color: "#6b21a8",
    icon: "CalendarIcon",
    hymn_numbers: [110, 115, 120, 128, 133, 135, 138]
  },
  {
    id: "col_advent_xmas",
    title: "Advent & Christmas Joy",
    title_twi: "Advent & Buronya Anigyeɛ",
    description: "Anticipation of the Savior's birth, the Incarnation, and festive nativity carols.",
    season: "Advent / Christmas",
    color: "#15803d",
    icon: "SparkleIcon",
    hymn_numbers: [70, 72, 75, 78, 80, 85, 90, 92]
  },
  {
    id: "col_communion",
    title: "Holy Communion & Fellowship",
    title_twi: "Awurade Adidie Kronkron",
    description: "Solemn and devotional hymns for the preparation and celebration of the Lord's Supper.",
    season: "General / Sacraments",
    color: "#b91c1c",
    icon: "CollectionIcon",
    hymn_numbers: [180, 181, 182, 185, 188, 190, 192]
  },
  {
    id: "col_morning_evening",
    title: "Morning & Evening Devotions",
    title_twi: "Anɔpa & Anwummere Nnwom",
    description: "Starting the day with praise and resting at night in God's keeping and peace.",
    season: "Daily Worship",
    color: "#0369a1",
    icon: "SunIcon",
    hymn_numbers: [3, 4, 5, 8, 12, 15, 20, 22]
  },
  {
    id: "col_burial_comfort",
    title: "Burial, Comfort & Eternal Hope",
    title_twi: "Ayiyɔ, Awerɛkyekye & Daa Nkwa",
    description: "Comfort in sorrow, eternal rest with Christ, and hope of the heavenly home.",
    season: "Funerals & Memorials",
    color: "#475569",
    icon: "InfoIcon",
    hymn_numbers: [280, 282, 285, 290, 294, 300, 305]
  }
];

export const CHURCH_SEASONS = [
  { name: "Epiphany", startMonth: 1, endMonth: 2, color: "#0284c7", theme: "Manifestation of Christ to the world" },
  { name: "Lent", startMonth: 2, endMonth: 4, color: "#7e22ce", theme: "Penitence, fasting & preparation" },
  { name: "Holy Week & Easter", startMonth: 4, endMonth: 5, color: "#d97706", theme: "Resurrection, victory & joy" },
  { name: "Pentecost & Trinity", startMonth: 5, endMonth: 6, color: "#dc2626", theme: "Holy Spirit and the Triune God" },
  { name: "Ordinary Time / Kingdom", startMonth: 6, endMonth: 11, color: "#16a34a", theme: "Growth in faith, discipleship & Christian living" },
  { name: "Advent & Christmas", startMonth: 11, endMonth: 12, color: "#1d4ed8", theme: "Preparation for the Lord's coming" }
];
