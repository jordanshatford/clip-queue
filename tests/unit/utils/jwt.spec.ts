import { parseJWT } from "@/utils/jwt";

describe("jwt.ts", () => {
  it("parses the payload from a jwt token", () => {
    const jwt =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dnZWRJbkFzIjoiYWRtaW4iLCJpYXQiOjE0MjI3Nzk2Mzh9.gzSraSYS8EXBxLN_oWnFSRgCzcmJmMjLiuyu5CSpyHI";
    expect(parseJWT(jwt)).toEqual({
      loggedInAs: "admin",
      iat: 1422779638,
    });
  });
});
