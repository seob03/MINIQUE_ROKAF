const express = require("express");
const router = express.Router();

router.get("/region", async (req, res) => {
    let { address } = req.query;
    console.log("입력 주소:", address);

    if (!address) return res.status(400).json({ error: "주소를 입력하세요." });

    // 검색 정확도를 높이기 위해 "대한민국"을 추가
    const query = `대한민국 ${address}`;

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&countrycodes=KR&addressdetails=1&q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (!data || data.length === 0) return res.status(404).json({ error: "주소를 찾을 수 없습니다." });

        // 여러 검색 결과의 시(city), 군(county), 구(town) 정보를 모두 처리
        const regions = data.map((result) => {
            const addr = result.address;
            // 시(city), 군(county), 구(town) 정보를 가공하여 새로운 region 객체 생성
            const region = `${addr.city || addr.town || addr.county || addr.state || ""} ${addr.suburb || ""}`.trim();
            return region;
        }).filter((region, index, self) => region && self.indexOf(region) === index);  // 중복 제거

        if (regions.length === 0) return res.status(404).json({ error: "도로명을 찾을 수 없습니다." });

        // 클라이언트에 지역 목록을 반환
        res.json({ regions });
    } catch (error) {
        console.error("주소 변환 중 오류 발생:", error);
        res.status(500).json({ error: "주소 변환 중 오류 발생" });
    }
});

module.exports = router;