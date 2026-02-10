const quizData = [
  {
    question:
      "Energi utama yang digunakan oleh panel surya untuk menghasilkan listrik adalah …",
    options: [
      "Energi panas bumi",
      "Energi cahaya matahari",
      "Energi air",
      "Energi angin",
    ],
    correct: 1,
  },
  {
    question:
      "Komponen utama panel surya yang mengubah cahaya menjadi listrik disebut …",
    options: ["Turbin", "Sel surya (solar cell)", "Baterai", "Inverter"],
    correct: 1,
  },
  {
    question:
      "Semakin tegak lurus cahaya matahari mengenai panel surya, maka energi listrik yang dihasilkan akan …",
    options: ["Berkurang", "Tetap", "Bertambah", "Tidak berubah"],
    correct: 2,
  },
  {
    question: "Salah satu manfaat penggunaan panel surya di rumah adalah …",
    options: [
      "Menghasilkan polusi udara",
      "Meningkatkan biaya listrik",
      "Menghemat energi listrik",
      "Merusak lingkungan",
    ],
    correct: 2,
  },
  {
    question: "Panel surya paling efisien digunakan di daerah yang …",
    options: [
      "Sering hujan",
      "Banyak pepohonan rindang",
      "Sering berawan",
      "Mendapat sinar matahari cukup banyak",
    ],
    correct: 3,
  },

  // B/S
  {
    question:
      "Panel surya dapat menghasilkan listrik meskipun tidak ada cahaya matahari.",
    options: ["Benar", "Salah"],
    correct: 1,
  },
  {
    question: "Panel surya termasuk sumber energi terbarukan.",
    options: ["Benar", "Salah"],
    correct: 0,
  },
  {
    question:
      "Energi listrik dari panel surya dapat disimpan menggunakan baterai.",
    options: ["Benar", "Salah"],
    correct: 0,
  },
  {
    question: "Panel surya menghasilkan suara bising saat beroperasi.",
    options: ["Benar", "Salah"],
    correct: 1,
  },
  {
    question:
      "Arah dan kemiringan panel surya tidak mempengaruhi jumlah energi yang dihasilkan.",
    options: ["Benar", "Salah"],
    correct: 1,
  },
];

let currentQuestion = 0;
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");

function loadQuestion() {
  const q = quizData[currentQuestion];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.classList.add("option");
    btn.textContent = opt;
    btn.onclick = () => selectOption(i);
    optionsEl.appendChild(btn);
  });
  nextBtn.style.display = "none";
}

function selectOption(i) {
  const q = quizData[currentQuestion];
  const opts = document.querySelectorAll(".option");
  opts.forEach((btn) => (btn.disabled = true));
  if (i === q.correct) {
    opts[i].classList.add("correct");
  } else {
    opts[i].classList.add("wrong");
    opts[q.correct].classList.add("correct");
  }
  nextBtn.style.display = "inline-block";
}

nextBtn.onclick = () => {
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    loadQuestion();
  } else {
    document.querySelector(
      ".quiz-container"
    ).innerHTML = `<h2 style="color:var(--brown)">Kuis Selesai!</h2><p>Hebat! kamu sudah belajar tentang panel surya 🌞</p><button onclick="location.reload()" id="next-btn">Ulangi</button>`;
  }
};

loadQuestion();
