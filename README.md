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

## 사용 가능한 도구 (26개)

### Company Profile (회사 정보)

| 도구 | 설명 | 무료 |
|------|------|:----:|
| `get_company_profile` | 회사 프로필 조회 (CEO, 섹터, 시가총액 등) | ✅ |
| `get_key_executives` | 주요 임원 정보 조회 | ❌ |
| `get_stock_peers` | 동종 업계 주식 조회 | ❌ |
| `get_company_rating` | 회사 등급 및 추천 조회 | ✅ |
| `get_company_notes` | 회사 핵심 정보 조회 | ❌ |
| `search_company` | 회사명/심볼 검색 | ✅ |

### Financial Statements (재무제표)

| 도구 | 설명 | 무료 |
|------|------|:----:|
| `get_income_statement` | 손익계산서 조회 | ✅ |
| `get_balance_sheet` | 재무상태표 조회 | ✅ |
| `get_cash_flow_statement` | 현금흐름표 조회 | ✅ |
| `get_financial_ratios` | 재무비율 조회 (ROE, ROA, 부채비율 등) | ✅ |
| `get_key_metrics` | 핵심 재무 지표 조회 (PER, PBR, EV 등) | ✅ |

### Charts (주가 차트)

| 도구 | 설명 | 무료 |
|------|------|:----:|
| `get_stock_chart_light` | 간단한 주가 차트 (종가, 거래량) | ✅ |
| `get_stock_price_volume` | OHLCV 데이터 (시가, 고가, 저가, 종가, 거래량) | ✅ |
| `get_dividend_adjusted_price` | 배당 조정 주가 | ✅ |
| `get_intraday_chart` | 장중 차트 (1분, 5분, 15분, 30분, 1시간, 4시간) | ❌ |

### Quote (실시간 시세)

| 도구 | 설명 | 무료 |
|------|------|:----:|
| `get_stock_quote` | 실시간 주식 시세 (가격, 변동, 시가총액, 52주 범위) | ✅ |
| `get_stock_quote_short` | 간단한 주식 시세 (가격, 변동, 거래량) | ✅ |
| `get_stock_price_change` | 기간별 주가 변동률 (1D, 5D, 1M, 3M, 6M, YTD, 1Y, 3Y, 5Y, 10Y) | ✅ |
| `get_aftermarket_trade` | 시간외 거래 데이터 | ✅ |
| `get_aftermarket_quote` | 시간외 호가 (bid/ask) | ✅ |
| `get_batch_stock_quotes` | 여러 종목 일괄 시세 조회 | ❌ |

### Other Assets (기타 자산)

| 도구 | 설명 | 무료 |
|------|------|:----:|
| `get_etf_quote` | ETF 시세 (SPY, QQQ 등) | ⚠️ |
| `get_forex_quote` | 외환 시세 (EURUSD, USDJPY 등) | ⚠️ |
| `get_crypto_quote` | 암호화폐 시세 (BTCUSD, ETHUSD 등) | ⚠️ |
| `get_commodity_quote` | 원자재 시세 (금, 원유 등) | ⚠️ |
| `get_index_quote` | 지수 시세 (S&P 500, NASDAQ 등) | ⚠️ |

> ✅ 무료 플랜 사용 가능 | ❌ 유료 플랜 필요 | ⚠️ 제한적 (일부 심볼만 가능)

## 파라미터 설명

### 공통 파라미터

| 파라미터 | 설명 | 예시 |
|----------|------|------|
| `symbol` | 주식 티커 심볼 | `AAPL`, `MSFT`, `GOOGL` |
| `period` | 조회 기간 | `annual` (연간), `quarter` (분기) |
| `limit` | 반환할 데이터 수 | `5` (기본값) |
| `from` | 시작 날짜 | `2024-01-01` |
| `to` | 종료 날짜 | `2024-12-31` |

### Intraday Chart 파라미터

| 파라미터 | 설명 | 값 |
|----------|------|-----|
| `interval` | 시간 간격 | `1min`, `5min`, `15min`, `30min`, `1hour`, `4hour` |

## 사용 예시

AI 어시스턴트에게 다음과 같이 요청할 수 있습니다:

### 회사 정보
- "애플(AAPL)의 회사 프로필을 조회해줘"
- "테슬라와 비슷한 회사들을 찾아줘"
- "삼성전자 검색해줘"

### 재무제표
- "마이크로소프트의 최근 5년 손익계산서를 보여줘"
- "엔비디아의 재무비율을 분석해줘"
- "애플의 분기별 현금흐름표 조회해줘"

### 주가 차트
- "AAPL 최근 30일 주가 차트 보여줘"
- "테슬라의 2024년 OHLCV 데이터 조회해줘"
- "배당 조정된 애플 주가 보여줘"

### 실시간 시세
- "애플 현재 주가 알려줘"
- "테슬라 주가 변동률 보여줘"
- "AAPL 시간외 거래 가격 알려줘"

### 기타 자산
- "비트코인 시세 조회해줘"
- "금 가격 알려줘"
- "S&P 500 지수 조회해줘"

## FMP API 제한사항

### 무료 플랜
- 하루 250회 API 호출
- 약 87개 심볼로 제한 (AAPL, TSLA, AMZN 등 주요 종목)
- End of Day 데이터만 제공
- Intraday 데이터 불가

### 유료 플랜
- 더 많은 API 호출 횟수
- 전체 심볼 접근
- Intraday 데이터 제공
- Batch 요청 지원

자세한 내용은 [FMP Pricing](https://site.financialmodelingprep.com/pricing-plans) 참조

## 라이선스

ISC
