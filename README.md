# Yonghun Multi-Tool UI Prototype

정적 HTML/CSS/JS만으로 구성된 멀티툴 대시보드 UI입니다. GitHub Pages에 바로 배포할 수 있도록 설계되었습니다.

## 특징
- **싱글 페이지 구조**: 사이드바/탑바/메인 패널 레이아웃으로 Dashboard, AI Chat, Memo, Mini Game, Files, Settings UI를 전환합니다.
- **글래스모피즘 디자인 시스템**: HSL 기반 라이트/다크 테마와 카드·버블 컴포넌트가 통일된 룩앤필을 제공합니다.
- **더미 데이터 렌더링**: JavaScript로 채팅 메시지, 메모 카드, 미니게임 카드, 파일 리스트를 더미 데이터로 채워 실제 서비스처럼 보이게 합니다.
- **테마 토글**: 라이트/다크/시스템 모드 전환이 가능하며 CSS 변수만 재정의하면 팔레트 확장이 쉽습니다.

## 파일 구조
```
.
├── index.html                # 전체 레이아웃과 섹션 정의
├── assets
│   ├── styles
│   │   ├── base.css          # 리셋 + 폰트 + 테마 변수
│   │   ├── layout.css        # 공통 레이아웃, 카드, 그리드
│   │   └── modules.css       # 섹션별 UI 스타일
│   └── scripts
│       └── app.js            # 네비게이션, 더미 데이터, 테마 토글
```

## 로컬 미리보기
```bash
cd /Users/syh/projects/github_page
npx serve
# 또는 python -m http.server
```
브라우저에서 `http://localhost:5000`(serve 기본 포트)이나 표시된 주소를 열면 됩니다.

## GitHub Pages 배포
1. GitHub에 새 저장소(`yonghun-tools` 등)를 만든 뒤 로컬 프로젝트에서 Git 초기화 및 커밋을 합니다.
2. 원격을 연결하고 `main`으로 푸시합니다.
3. 저장소 **Settings → Pages**에서 Branch를 `main`, Folder를 `/root`로 설정하면 `https://계정.github.io/저장소명/`에서 확인할 수 있습니다.

필요에 따라 UI 컴포넌트를 확장하거나 실제 기능을 붙일 수 있도록 구조를 단순하게 유지했습니다.
