/* 
 * After Entertainment - 메인 스크립트
 * 기능: 헤더 스크롤 효과, 페이지 활성화 상태, 문의 폼 처리, 
 *       스크롤 애니메이션, 페이지 전환 효과, 무한 슬라이더, 히어로 이미지 슬라이더
 * 최종 수정: 2026-01-14
 */

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');

    // 1. 헤더 스크롤 효과
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. 현재 페이지 링크 활성화 (Active State)
    let currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active');
        }
    });

    // 2-1. 모바일 메뉴 토글 로직 추가
    const menuToggle = document.getElementById('mobile-menu');
    const nav = document.querySelector('.nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('is-active');
            nav.classList.toggle('is-active');

            // 메뉴 열릴 때 바디 스크롤 방지
            if (nav.classList.contains('is-active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });

        // 메뉴 링크 클릭 시 메뉴 닫기
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('is-active');
                nav.classList.remove('is-active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // 3. 문의하기 폼 제출 처리
    const inquiryForm = document.getElementById('inquiryForm');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('문의가 정상적으로 접수되었습니다. 담당자가 곧 연락드리겠습니다.');
            inquiryForm.reset();
        });
    }

    // 4. 간단한 등장 애니메이션 (스크롤 시)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        // 히어로 섹션과 서브 비주얼 섹션은 배경이 즉시 보여야 하므로 애니메이션 없이 즉시 노출
        // (서브 비주얼 내부의 텍스트 애니메이션은 CSS에서 처리됨)
        if (section.classList.contains('hero') || section.classList.contains('sub-visual')) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
            return;
        }

        section.style.opacity = '0';
        section.style.transform = 'translateY(40px)';
        section.style.transition = 'all 1.2s cubic-bezier(0.2, 0, 0.2, 1)';
        observer.observe(section);
    });

    // 페이지 진입 시점에 혹시 남아있을 수 있는 fade-out 클래스 강제 제거
    document.body.classList.remove('fade-out');

    // 5. 페이지 페이드아웃 및 캐시 대응 (뒤로가기 시 흰 화면 방지)
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const target = this.getAttribute('target');

            // 내부 .html 페이지 이동 시에만 페이드아웃 애니메이션 적용
            if (href && href.endsWith('.html') && !href.startsWith('http') && href !== currentPath && target !== '_blank') {
                e.preventDefault();
                document.body.classList.add('fade-out');

                // 애니메이션 시간(0.8초) 후 페이지 이동
                setTimeout(() => {
                    window.location.href = href;
                }, 800);
            }
        });
    });

    // 브라우저 뒤로가기/앞으로가기 등으로 페이지가 다시 활성화될 때 (BFcache 대응)
    window.addEventListener('pageshow', (event) => {
        // 캐시된 상태에서 복원될 때 fade-out 클래스를 제거하고 페이드인 효과 보장
        document.body.classList.remove('fade-out');

        // 뒤로가기 시 페이드인 애니메이션이 다시 작동하도록 처리
        if (event.persisted) {
            document.body.style.animation = 'none';
            void document.body.offsetWidth; // 리플로우 강제 발생
            document.body.style.animation = 'fadeInPage 1.2s ease-out forwards';
        }
    });

    // 6. 무한 슬라이더 아이템 복제 (메인 페이지 전용)
    const sliderTrack = document.getElementById('sliderTrack');
    if (sliderTrack) {
        const items = sliderTrack.innerHTML;
        sliderTrack.innerHTML = items + items; // 동일한 아이템들을 뒤에 한 세트 더 추가
    }

    // 7. 히어로 슬라이더 로직
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 3000);
    }

    // 8. 포트폴리오 관리 시스템 (데이터 기반 동적 생성)
    const portfolioContainer = document.getElementById('portfolioItems');
    if (portfolioContainer) {
        /* 
         * [포트폴리오 업로드 안내]
         * 새로운 포트폴리오를 추가하려면 아래 portfolioData 배열의 맨 앞에 추가하세요.
         * title: 제목
         * desc: 설명
         * thumbnail: 목록에 표시될 대표 이미지
         * images: 클릭 시 팝업(모달)에서 보여줄 이미지 리스트 (여러 장 가능)
         */
        const portfolioData = [
            {
                title: "2025 글로벌 IT 혁신 컨퍼런스",
                desc: "전 세계 IT 리더 500인이 모인 프리미엄 국제 행사",
                thumbnail: "image/portfolio/1.jpg",
                images: ["image/portfolio/1.jpg", "image/portfolio/2.jpg", "image/portfolio/3.jpg"]
            },
            {
                title: "Nexus 런칭 쇼케이스",
                desc: "감각적인 미디어 파사드와 차량 퍼포먼스의 환상적 조화",
                thumbnail: "image/portfolio/1.jpg",
                images: ["image/portfolio/1.jpg", "image/portfolio/2.jpg"]
            },
            {
                title: "K-FOOD 월드 페스티벌",
                desc: "한식의 세계화를 위한 글로벌 미식 축제 기획 및 운영",
                thumbnail: "image/portfolio/1.jpg",
                images: ["image/portfolio/1.jpg"]
            },
            {
                title: "디지털 아트 컨텐포러리 전시",
                desc: "몰입형 미디어 아트를 활용한 전시 공간 디자인",
                thumbnail: "image/portfolio/1.jpg",
                images: ["image/portfolio/1.jpg"]
            },
            {
                title: "건축 디자인 어워드 2024",
                desc: "국내 최고의 건축가들이 참여한 시상식 및 전시 기획",
                thumbnail: "image/portfolio/1.jpg",
                images: ["image/portfolio/1.jpg"]
            },
            {
                title: "테크 서밋 오픈 이노베이션",
                desc: "대기업 및 스타트업 협력을 위한 비즈니스 네트워킹 행사",
                thumbnail: "image/portfolio/1.jpg",
                images: ["image/portfolio/1.jpg"]
            },
            {
                title: "메타버스 패션 위크 2024",
                desc: "가상 세계와 현실을 잇는 하이브리드 패션쇼 운영",
                thumbnail: "image/portfolio/1.jpg",
                images: ["image/portfolio/1.jpg"]
            },
            {
                title: "시네마틱 오케스트라 콘서트",
                desc: "대형 LED 스크린과 오케스트라의 환상적인 협연",
                thumbnail: "image/portfolio/1.jpg",
                images: ["image/portfolio/1.jpg"]
            },
            {
                title: "스마트 시티 비전 선포식",
                desc: "미래 도시 비전을 시각화한 대규모 미디어 퍼포먼스",
                thumbnail: "image/portfolio/1.jpg",
                images: ["image/portfolio/1.jpg"]
            },
            {
                title: "뷰티 브랜드 글로우 팝업스토어",
                desc: "MZ세대를 겨냥한 감각적인 브랜드 체험 공간 구성",
                thumbnail: "image/portfolio/1.jpg",
                images: ["image/portfolio/1.jpg", "image/portfolio/2.jpg", "image/portfolio/3.jpg"]
            },
            {
                title: "AI 컨퍼런스 투데이",
                desc: "인공지능 기술의 미래를 논하는 지식 공유의 장",
                thumbnail: "image/portfolio/1.jpg",
                images: ["image/portfolio/1.jpg"]
            },
            {
                title: "스포츠카 챌린지 2024",
                desc: "역동적인 드라이빙 퍼포먼스와 레이싱 페스티벌",
                thumbnail: "image/portfolio/1.jpg",
                images: ["image/portfolio/1.jpg"]
            },
            {
                title: "에너지 혁신 포럼",
                desc: "지속 가능한 미래를 위한 에너지 산업 전문가 회의",
                thumbnail: "image/portfolio/1.jpg",
                images: ["image/portfolio/1.jpg"]
            }
            // 이곳에 새로운 항목을 추가하세요.
        ];

        const pagination = document.getElementById('pagination');
        const itemsPerPage = 12; // 한 페이지에 표시할 개수 (3*4)
        let currentPage = 1;

        // 아이템 렌더링 함수
        function renderItems(page) {
            portfolioContainer.innerHTML = '';
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const pagedData = portfolioData.slice(start, end);

            pagedData.forEach(data => {
                const item = document.createElement('div');
                item.className = 'portfolio-item';
                item.innerHTML = `
                    <div class="portfolio-item-image" style="background-image: url('${data.thumbnail}')">
                        <div class="portfolio-item-overlay">
                            <span>자세히 보기</span>
                        </div>
                    </div>
                    <h3>${data.title}</h3>
                    <p>${data.desc}</p>
                `;

                // 클릭 시 모달 오픈 이벤트 연결
                item.addEventListener('click', () => openModal(data));
                portfolioContainer.appendChild(item);
            });

            updatePagination(page);
        }

        // 페이지네이션 업데이트 함수
        function updatePagination(activePage) {
            const pageCount = Math.ceil(portfolioData.length / itemsPerPage);
            pagination.innerHTML = '';

            for (let i = 1; i <= pageCount; i++) {
                const btn = document.createElement('button');
                btn.innerText = i;
                btn.classList.add('page-btn');
                if (i === activePage) btn.classList.add('active');
                btn.addEventListener('click', () => {
                    renderItems(i);
                    window.scrollTo({ top: portfolioContainer.offsetTop - 100, behavior: 'smooth' });
                });
                pagination.appendChild(btn);
            }
        }

        // 모달 관련 요소 및 슬라이드 로직
        const modal = document.getElementById('portfolioModal');
        const modalImg = document.getElementById('modalImage');
        const captionText = document.getElementById('modalCaption');
        const counterText = document.getElementById('modalCounter');
        const closeBtn = document.querySelector('.modal-close');
        const prevBtn = document.querySelector('.modal-prev');
        const nextBtn = document.querySelector('.modal-next');

        let currentImageSet = [];
        let currentImageIdx = 0;

        function openModal(data) {
            currentImageSet = data.images || [data.thumbnail];
            currentImageIdx = 0;

            modal.style.display = "block";
            updateModalContent(data.title);
            document.body.style.overflow = 'hidden';

            // 이미지 개수에 따라 버튼 노출 여부 결정
            if (currentImageSet.length > 1) {
                prevBtn.style.display = "block";
                nextBtn.style.display = "block";
            } else {
                prevBtn.style.display = "none";
                nextBtn.style.display = "none";
            }
        }

        function updateModalContent(title) {
            modalImg.src = currentImageSet[currentImageIdx];
            captionText.innerHTML = title;
            counterText.innerHTML = `${currentImageIdx + 1} / ${currentImageSet.length}`;
        }

        // 이전/다음 버튼 이벤트
        prevBtn.onclick = (e) => {
            e.stopPropagation();
            currentImageIdx = (currentImageIdx - 1 + currentImageSet.length) % currentImageSet.length;
            updateModalContent(captionText.innerHTML);
        };

        nextBtn.onclick = (e) => {
            e.stopPropagation();
            currentImageIdx = (currentImageIdx + 1) % currentImageSet.length;
            updateModalContent(captionText.innerHTML);
        };

        if (closeBtn) {
            closeBtn.onclick = () => {
                modal.style.display = "none";
                document.body.style.overflow = 'auto';
            };
        }

        window.onclick = (event) => {
            if (event.target == modal) {
                modal.style.display = "none";
                document.body.style.overflow = 'auto';
            }
        };

        // 초기 실행
        const countDisplay = document.getElementById('portfolioCount');
        if (countDisplay) {
            countDisplay.innerText = portfolioData.length;
        }
        renderItems(1);
    }
});
