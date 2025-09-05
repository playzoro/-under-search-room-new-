document.addEventListener('DOMContentLoaded', () => {
    // 탭 메뉴 관련 변수
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // 탭 전환 기능
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            // 모든 탭 버튼과 콘텐츠에서 'active' 클래스 제거
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // 클릭된 버튼과 해당 콘텐츠에 'active' 클래스 추가
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // 각 탭의 검색 기능
    const searchFunction = (inputElementId, resultElementId, dataFile, fields) => {
        const inputElement = document.getElementById(inputElementId);
        const resultElement = document.getElementById(resultElementId);
        const searchButton = inputElement.nextElementSibling; // 바로 다음 형제 요소인 버튼

        let data;

        fetch(dataFile)
            .then(response => response.json())
            .then(json => {
                data = json;
            })
            .catch(error => {
                console.error(`Error loading ${dataFile}:`, error);
                resultElement.innerHTML = '데이터 로딩에 실패했습니다.';
            });
        
        const performSearch = () => {
            const query = inputElement.value.trim().toLowerCase();
            let found = false;

            if (data) {
                for (let item of data) {
                    if (item.name.toLowerCase().includes(query)) {
                        let html = '';
                        fields.forEach(field => {
                            // 필드에 따라 HTML을 동적으로 생성
                            if (field.key === 'name') {
                                html += `<h4>${item.name}</h4>`;
                            } else {
                                html += `<p><strong>${field.label}:</strong> ${item[field.key]}</p>`;
                            }
                        });
                        resultElement.innerHTML = html;
                        found = true;
                        break;
                    }
                }
            }
            if (!found) {
                resultElement.innerHTML = '일치하는 정보가 없습니다.';
            }
        };

        searchButton.addEventListener('click', performSearch);
        inputElement.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
    };

    // 각 탭에 검색 기능 적용
    searchFunction('diseaseInput', 'diseaseResult', './data/diseases.json', [
        { key: 'name', label: '질병명' },
        { key: 'code', label: 'KCD코드' },
        { key: 'description', label: '질병설명' },
        { key: 'severity', label: '중증여부' }
    ]);
    
    searchFunction('jobInput', 'jobResult', './data/jobs.json', [
        { key: 'name', label: '직업명' },
        { key: 'code', label: '직업분류코드' },
        { key: 'description', label: '직업설명' }
    ]);
    
    searchFunction('coverageInput', 'coverageResult', './data/coverages.json', [
        { key: 'name', label: '담보명' },
        { key: 'description', label: '담보보장내용' },
        { key: 'amount', label: '가입가능금액' }
    ]);
});