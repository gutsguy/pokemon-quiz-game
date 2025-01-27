

# 🔎**포켓몬 지식**도 스펙이 될 수 있을까요?

- **증빙 자료**만 있으면 스펙이 될 수도 있습니다.
- **포켓몬 퀴즈 게임**에서는 본인의 **포켓몬 지식**을 증명할 수 있습니다.
- 포켓몬 퀴즈 게임 **전세계 1등**을 노려보세요!

### 개발 툴

- **FE** : React
- **BE** : Node.js, RestAPI
- **DB** : MongoDB
- **Language** : JavaScript
- **Design** : Figma
- **IDE** : vscode
- **Coop** : Github

### 팀원 소개

**임수민**

- KAIST 신소재공학과 22학번
- https://github.com/suelim02

**조어진**

- UNIST 컴퓨터공학과 20학번
- https://github.com/gutsguy

---

## <Design Details>

### 1. 로그인 화면


- 포켓몬 퀴즈 게임은 카카오 로그인을 지원합니다.
- 양 옆의 지우와 오박사의 이미지는 css의 `drop-shadow`와 `tilt` 기능을 사용하여 `mouse pointer` 를 따라 입체적으로 기울어집니다.
- 페이지에 접속할 때 마다 [**`PokéAPI`](https://pokeapi.co/)** 에서 랜덤 포켓몬 정보를 `fetch` 하여 실루엣을 보여줍니다.
- 여러번 새로고침을 하여 본 게임에 들어가기 전 미리 예열을 하고 들어갈 수 있도록 합시다.


### 2. 로비 화면

- 로비 화면에서는 **게임시작** 버튼이 있고, 자신의 **프로필**과 **리더보드**를 확인할 수 있습니다.
- 프로필의 **정답률**과 **하이스코어**는 `DB`에 저장되며, 매 게임을 할 때마다 갱신됩니다.
    - 하이스코어
    - 이지 모드 정답률
    - 하드 모드 정답률
    - 총 진행한 라운드 수
- 게임 시작 버튼을 누르면 **게임 모드 설정**을 할 수 있는 팝업 창이 나옵니다.
    - **이지 모드** : 각 라운드의 time limit이 30초 입니다.
    - **하드 모드** : 각 라운드의 time limit이 15초 입니다.
    - **무한 모드** : 각 라운드의 time limit이 10초 이고, 이름 맞히기를 실패할 때까지 계속됩니다.
        - 모든 세대의 포켓몬이 전부 출현합니다.
        - 맞힌 문제의 개수 만큼 하이스코어에 반영됩니다.
        - **고득점**을 노려 리더보드에 이름을 올려보세요.
    - 원하는 **세대를 선택**하여 특정 세대의 포켓몬만을 선택할 수 있습니다.
    - 연식이 있어 최근 포켓몬을 모르는 사람은 예전 세대를 선택해서 게임을 즐겨보세요!
    

### 3. 게임 화면


- 게임은 매 라운드마다 **랜덤**으로 선택된 포켓몬의 힌트를 순서대로 보여줍니다.
- 힌트는 **주요색 - 세대 - 타입 - 글자수 - 픽셀화 - 실루엣** 순서입니다.
- **채팅 창**에 정답을 입력할 수 있고, 정답을 맞췄을 경우 채팅이 **보라색**으로 표시됩니다. 또한 정답 이미지와 이름이 곧바로 나옵니다.
- 시간이 전부 지나가 버리면 자동으로 정답 이미지와 이름이 나오며, 오답으로 처리되어 DB에 저장됩니다.
- **이지 모드**와 **하드 모드**에서는 정해진 최대 라운드가 끝나면 결과 확인 팝업 창이 나옵니다.
- **무한 모드**는 한 번만 정답을 맞히지 못해도 게임이 종료되지만, 리더보드에 반영될 수 있습니다.

### 4. APIs

[APIs](https://www.notion.so/5ba4008a908d49cbb85b166b51c7f212?pvs=21)

### 5. 개발 후기

- **조어진** : 처음에 실시간 통신 게임을 만들 생각으로 시작했지만, 기술력 부족으로 인해 솔로플레이로 바꾼 게 너무 아쉽습니다. 그냥 제가 좋아서 시작한 기획인데 오케이해주고 열심히 같이 해준 팀원에게 고맙고, 기회가 된다면 더 좋은 게임으로 진화 시켜주고 싶습니다.


- **임수민** :  서버와 DB를 연결하여 무언가 구현해본 경험이 처음이라 개념 이해부터 다소 어렵게 느껴졌다. kVPN 사용부터 서버 연결, 로그인 그 후의 과정까지 매 단계 단계 고비가 있었지만 실제로 만들어서 게임을 진행해보니 뿌듯하다. 많은 부분을 배워간 것 같아서 기분이 좋고 많은 부분에서 헤맸는데 방향성을 제시하고 답을 알려주신 팀원분께 감사합니다.

K-VPN 연결 후 접속

게임 url : http://172.10.7.78:3000
