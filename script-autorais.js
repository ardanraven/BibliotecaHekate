// ---- LÓGICA DA BIBLIOTECA - LIVROS AUTORAIS ----

function loadLibraryAutorais() {
    // !!! SUA URL DO NOVO SCRIPT PARA LIVROS AUTORAIS AQUI !!!
    const scriptUrlAutorais = "https://script.google.com/macros/s/AKfycbwssOFWnah9COXcvRPTelyT0ZouZvDFAPao9vvsX0ayyR1sdZSzDvmHJ3Pt5X1l_0dxzg/exec"; // URL DA PASTA AUTORAIS

    // Caminho para sua capa padrão.
    const fallbackCapa = 'capa-autorais.png'; // A capa que queremos FORÇAR

    let pdfDataAutorais = [];

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
            pdfDataAutorais = await response.json();
            
            if (pdfDataAutorais.error) {
                 console.error("Erro do Apps Script Autorais:", pdfDataAutorais.error);
                 pdfListContainer.innerHTML = "<p class='error-message'>Ocorreu um erro ao carregar os livros autorais.</p>";
            } else {
                displayPdfList(pdfDataAutorais);
            }
            
        } catch (error) {
            console.error("Erro ao buscar ficheiros autorais:", error);
            pdfListContainer.innerHTML = "<p class='error-message'>Ocorreu um erro ao carregar os livros autorais. Verifique sua conexão ou tente novamente mais tarde.</p>";
        }
    }

    function displayPdfList(data) {
        const pdfListContainer = document.getElementById("pdf-list");
        if (!pdfListContainer) return;
        
        pdfListContainer.innerHTML = "";
        
        if (data.length === 0) {
            pdfListContainer.innerHTML = "<p class='no-results-message'>Nenhum livro autoral encontrado nesta seção. ✨</p>";
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
            const filteredData = pdfDataAutorais.filter(file => file.name.toLowerCase().includes(searchTerm));
            displayPdfList(filteredData);
        });
    }

    getPdfList(scriptUrlAutorais); // Carrega a lista inicial de PDFs da pasta de Autorais
}

document.addEventListener("DOMContentLoaded", loadLibraryAutorais);