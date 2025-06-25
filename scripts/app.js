// To add custom background to images, add the Id of the desired card (from the spreadsheet) to this array, 
// and add the image (whose name must be equal to the Id number) to /images/backgrounds
const backgroundImageIds = ["158", "1", "2", "3", "22","44","88","106","126"];

const imageExtensions = [".jpg", ".jpeg", ".png", ".webp"];

document.getElementById("generateBtn").addEventListener("click", function () {
  document.getElementById("csvFile").click();
});

document.getElementById("csvFile").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) return;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      generateCards(results.data);
    },
  });
});

async function generateCards(data) {
  const output = document.getElementById("output");
  output.innerHTML = "";

  for (const row of data) {
    const clanSrc = `images/clans/${row.Sect.trim().toLowerCase()}/${row.Clan.trim().toLowerCase()}.png`;
    const sectSrc = `images/sects/${row.Sect.trim().toLowerCase()}.png`;
    const id = row.Id.trim();
    const bloodTotal = row.Blood;
    const strength = row.Strength;
    const name = row.Name;
    const age = row.Age;
    const artist = row.Artist;

    // --- converts numbers to dots, so Retainers 2 shows as Retainers ●●
    let backgrounds = "";
    const backgroundList = row.Backgrounds ? row.Backgrounds.split(",") : [];
    backgroundList.forEach((bg) => {
      const parts = bg.trim().split(" ");
      if (parts.length === 2 && !isNaN(parts[1])) {
        backgrounds += `${parts[0]} ${"●".repeat(parseInt(parts[1]))} `;
      }
    });

    const merits = row.Merits || "";

    let backgroundsHtml =
      backgrounds.trim().length > 0
        ? `<div class="backgrounds">${backgrounds.trim()}</div>`
        : "";
    let meritsHtml =
      merits.trim().length > 0
        ? `<div class="merits">${merits.trim()}</div>`
        : "";

    let disciplinesHTML = "";
    const disciplineList = row.Disciplines
      ? row.Disciplines.split(",").map((d) => d.trim())
      : [];

    let disciplineDivClass = age.toLowerCase();
    let disciplineImgs = "";

    disciplineList.forEach((d) => {
      disciplineImgs += `<img src="images/disciplines/${d}.png" alt="${d}">`;
    });

    disciplinesHTML = `
            <div class="${disciplineDivClass}">
                ${disciplineImgs}
            </div>
        `;

    const cardHTML = `
        <div class="main item-${row.Id}">
            <header>
                <div class="clan">
                    <img src="${clanSrc}" alt="${row.Clan}">
                </div>
                <div class="name">${name}</div>
                <div class="sect">
                    <img src="${sectSrc}" alt="${row.Sect}">
                </div>
            </header>

            <div class="text">
                ${backgroundsHtml}
                ${meritsHtml}
                <div class="ability">${row.Text.trim()}</div>
                <div class="age">${age}</div>
            </div>

            <div class="footer">
                <div class="strength">${strength}</div>
                <div class="footerContent">
                    <div class="disciplines">${disciplinesHTML}</div>
                    <div class="separator"></div>
                    ${
                      artist.trim() !== ""
                        ? `<div class="artist">Art by ${artist}</div>`
                        : ""
                    }
                </div>
                <div class="blood">
                    <img src="images/base/bd.png" alt="Blood Icon">
                    <div class="bloodTotal">${bloodTotal}</div>
                </div>
            </div>
        </div>
        `;

    output.insertAdjacentHTML("beforeend", cardHTML);

    const currentItem = document.querySelector(".item-" + row.Id);

    if (backgroundImageIds.includes(id)) {
      const bgUrl = await findValidBackgroundSrc(id);
      currentItem.style.backgroundImage = `url('${bgUrl}')`;
    } else {
      currentItem.style.backgroundImage =
        "url('/images/backgrounds/placeholder.jpg')";
    }
    document.getElementById("download-btn").style.display = "inline-block";
  }

  async function findValidBackgroundSrc(id) {
    const base = `/images/backgrounds/${id}`;

    for (let ext of imageExtensions) {
      const url = `${base}${ext}`;
      const exists = await imageExists(url);
      if (exists) return url;
    }

    return "/images/backgrounds/placeholder.jpg";
  }

  function imageExists(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  document
    .getElementById("download-btn")
    .addEventListener("click", async () => {
      const zip = new JSZip();
      const cards = document.querySelectorAll(".main");

      for (let i = 0; i < cards.length; i++) {
        const cardElement = cards[i];

        let vampireName =
          cardElement.querySelector(".name")?.innerText.trim() ||
          `card_${i + 1}`;
        vampireName = vampireName.replace(/[/\\?%*:|"<>]/g, "-");

        const canvas = await html2canvas(cardElement, {
          ignoreElements: (element) => false,
          backgroundColor: null,
          scale: 2,
        });

        const dataUrl = canvas.toDataURL("image/png");
        const imgData = dataUrl.split(",")[1];

        zip.file(`${vampireName}.png`, imgData, { base64: true });
      }

      zip.generateAsync({ type: "blob" }).then((blob) => {
        saveAs(blob, "cards.zip");
      });
    });
}
