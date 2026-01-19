# FMP MCP Server

Financial Modeling Prep (FMP) API를 위한 Model Context Protocol (MCP) 서버입니다.
AI 어시스턴트(Claude, Cursor 등)에서 금융 데이터를 조회할 수 있게 해줍니다.

## 요구사항

- Node.js 18 이상
- FMP API 키 ([financialmodelingprep.com](https://financialmodelingprep.com)에서 발급)

## 설치

```bash
git clone <repository-url>
cd fmp-mcp-local-server
npm install
```

## 설정

### Claude Desktop

`~/Library/Application Support/Claude/claude_desktop_config.json` 파일에 추가:

```json
{
  "mcpServers": {
    "fmp": {
      "command": "node",
      "args": ["/path/to/fmp-mcp-local-server/index.js"],
      "env": {
        "FMP_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### Cursor

`.cursor/mcp.json` 파일에 추가:

```json
{
  "mcpServers": {
    "fmp": {
      "command": "node",
      "args": ["/path/to/fmp-mcp-local-server/index.js"],
      "env": {
        "FMP_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### Claude Code (VS Code Extension)

`.claude/settings.json` 파일에 추가:

```json
{
  "mcpServers": {
    "fmp": {
      "command": "node",
      "args": ["/path/to/fmp-mcp-local-server/index.js"],
      "env": {
        "FMP_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

> `/path/to/fmp-mcp-local-server`를 실제 프로젝트 경로로 변경하세요.

## 사용 가능한 도구

### 회사 정보

| 도구 | 설명 |
|------|------|
| `get_company_profile` | 회사 프로필 조회 (CEO, 섹터, 시가총액 등) |
| `get_key_executives` | 주요 임원 정보 조회 |
| `get_stock_peers` | 동종 업계 주식 조회 |
| `get_company_rating` | 회사 등급 및 추천 조회 |
| `get_company_notes` | 회사 핵심 정보 조회 |
| `search_company` | 회사명/심볼 검색 |

### 재무제표

| 도구 | 설명 |
|------|------|
| `get_income_statement` | 손익계산서 조회 |
| `get_balance_sheet` | 재무상태표 조회 |
| `get_cash_flow_statement` | 현금흐름표 조회 |
| `get_financial_ratios` | 재무비율 조회 |
| `get_key_metrics` | 핵심 재무 지표 조회 |

### 주가 데이터

| 도구 | 설명 |
|------|------|
| `get_stock_chart_light` | 간단한 주가 차트 (종가, 거래량) |
| `get_stock_price_volume` | OHLCV 데이터 |
| `get_dividend_adjusted_price` | 배당 조정 주가 |
| `get_intraday_chart` | 장중 차트 (유료 플랜 필요) |

## 사용 예시

AI 어시스턴트에게 다음과 같이 요청할 수 있습니다:

- "애플(AAPL)의 회사 프로필을 조회해줘"
- "마이크로소프트의 최근 5년 손익계산서를 보여줘"
- "테슬라와 비슷한 회사들을 찾아줘"
- "엔비디아의 재무비율을 분석해줘"

## 라이선스

ISC
