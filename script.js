// ---- LÓGICA DA BIBLIOTECA PRINCIPAL ----

function loadLibrary() {
    // !!! SUA URL DO SCRIPT PRINCIPAL AQUI !!!
    const scriptUrlPrincipal = "https://script.google.com/macros/s/AKfycbybTl332TVcvMsBCBEd7hGi-b4d3hordlljEvHvSXK3-RBGyfnM3LqxiajeLKjkt5Ye/exec"; // URL DA PASTA PRINCIPAL

    // Caminho para sua capa padrão.
    const fallbackCapa = 'capa-padrao.png'; // A capa Hekatina
    
    let pdfData = [];

    async function getPdfList(url) {
        const pdfListContainer = document.getElementById("pdf-list");
        if (!pdfListContainer) return;

        pdfListContainer.innerHTML = `
            <div id="loading-spinner" class="loading-spinner">
                <div class="spinner-key">🔑</div>
                <div class="spinner-text">Abrindo os portais...</div>
            </div>
        `;
        
        try {
            const response = await fetch(url);
            pdfData = await response.json();
            
            if (pdfData.error) {
                 console.error("Erro do Apps Script:", pdfData.error);
                 pdfListContainer.innerHTML = "<p class='error-message'>Ocorreu um erro ao carregar os livros. (Verifique o console para detalhes)</p>";
            } else {
                displayPdfList(pdfData);
            }
            
        } catch (error) {
            console.error("Erro ao buscar ficheiros:", error);
            pdfListContainer.innerHTML = "<p class='error-message'>Ocorreu um erro ao carregar os livros. Verifique sua conexão ou tente novamente mais tarde.</p>";
        }
    }

    function displayPdfList(data) {
        const pdfListContainer = document.getElementById("pdf-list");
        if (!pdfListContainer) return;
        
        pdfListContainer.innerHTML = "";
        
        if (data.length === 0) {
            pdfListContainer.innerHTML = "<p class='no-results-message'>Nenhum livro encontrado nesta seção. ✨</p>";
            return;
        }
        
        data.forEach(file => {
            const pdfItem = document.createElement("div");
            pdfItem.classList.add("pdf-item");
            
            pdfItem.innerHTML = `
                <div class="pdf-cover-container">
                    
                    <img src="${fallbackCapa}" 
                         alt="Capa de ${file.name}" 
                         class="pdf-cover-image" 
                         onerror="this.onerror=null;this.src='${fallbackCapa}';">
                </div>
                <div class="pdf-info-container">
                    <p class="book-title">${file.name.replace(/\.pdf$/i, '')}</p>
                    <a href="${file.url}" target="_blank" class="view-button">📖 Visualizar</a>
                </div>
            `;
            pdfListContainer.appendChild(pdfItem);
        });
    }

    const searchInput = document.getElementById("search");
    if (searchInput) {
        searchInput.addEventListener("input", function() {
            const searchTerm = this.value.toLowerCase();
            const filteredData = pdfData.filter(file => file.name.toLowerCase().includes(searchTerm));
            displayPdfList(filteredData);
        });
    }

    getPdfList(scriptUrlPrincipal); // Carrega a lista inicial de PDFs da pasta principal
}

document.addEventListener("DOMContentLoaded", loadLibrary);
