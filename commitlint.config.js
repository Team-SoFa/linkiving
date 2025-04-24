module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "test",
        "chore",
        "design",
        "comment",
        "rename",
        "remove",
      ],
    ],
    "type-case": [2, "always", "lower-case"],
    "subject-empty": [2, "never"], // subject가 비어 있을 수 없음
    "type-empty": [2, "never"], // type이 비어 있을 수 없음
    "subject-full-stop": [2, "never", "."], // 서브젝트 끝에 점을 사용하지 않음
    "header-case": [2, "always", "lower-case"], // header를 소문자로 설정
  },
  plugins: [
    {
      rules: {
        "header-match-team-format": ({ header }) => {
          const hasNoSpaceAroundColon = /^[a-z]+:.+/.test(header);
          const valid = hasNoSpaceAroundColon;
          return [
            valid,
            `❌ 커밋 메시지는 다음 형식을 따라야 합니다:
  
  타입:설명
  
  - 콜론(:) 앞뒤에 공백이 없어야 합니다.
  
  ✅ 예시:
  feat:변경 애용 설명`,
          ];
        },
      },
    },
  ],
};
