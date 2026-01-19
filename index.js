#!/usr/bin/env node

const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { z } = require("zod/v4");

const FMP_BASE_URL = "https://financialmodelingprep.com/stable";

// API 키는 환경변수에서 가져옴
const getApiKey = () => {
  const apiKey = process.env.FMP_API_KEY;
  if (!apiKey) {
    throw new Error("FMP_API_KEY environment variable is required");
  }
  return apiKey;
};

// FMP API 호출 헬퍼 함수
async function fetchFromFMP(endpoint, params = {}) {
  const apiKey = getApiKey();
  const url = new URL(`${FMP_BASE_URL}${endpoint}`);
  url.searchParams.append("apikey", apiKey);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`FMP API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// MCP 서버 생성
const server = new McpServer({
  name: "fmp-mcp-server",
  version: "1.0.0",
  description: "Financial Modeling Prep API MCP Server - Company Profile"
});

// Tool 1: Company Profile - 특정 심볼의 회사 프로필 조회
server.tool(
  "get_company_profile",
  "Get detailed company profile information including description, CEO, sector, industry, market cap, and more",
  {
    symbol: z.string().describe("Stock ticker symbol (e.g., AAPL, MSFT, GOOGL)")
  },
  async ({ symbol }) => {
    try {
      const data = await fetchFromFMP(`/profile`, { symbol: symbol.toUpperCase() });

      if (!data || data.length === 0) {
        return {
          content: [{ type: "text", text: `No company profile found for symbol: ${symbol}` }]
        };
      }

      const profile = data[0];
      const result = {
        symbol: profile.symbol,
        companyName: profile.companyName,
        price: profile.price,
        marketCap: profile.mktCap,
        sector: profile.sector,
        industry: profile.industry,
        ceo: profile.ceo,
        website: profile.website,
        description: profile.description,
        country: profile.country,
        city: profile.city,
        state: profile.state,
        address: profile.address,
        fullTimeEmployees: profile.fullTimeEmployees,
        ipoDate: profile.ipoDate,
        exchange: profile.exchange,
        currency: profile.currency,
        beta: profile.beta,
        volAvg: profile.volAvg,
        lastDiv: profile.lastDiv,
        range: profile.range,
        changes: profile.changes,
        dcfDiff: profile.dcfDiff,
        dcf: profile.dcf,
        image: profile.image
      };

      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error fetching company profile: ${error.message}` }],
        isError: true
      };
    }
  }
);

// Tool 2: Key Executives - 회사 주요 임원 정보 조회
server.tool(
  "get_key_executives",
  "Get information about key executives of a company including their names, titles, and compensation",
  {
    symbol: z.string().describe("Stock ticker symbol (e.g., AAPL, MSFT, GOOGL)")
  },
  async ({ symbol }) => {
    try {
      const data = await fetchFromFMP(`/key-executives`, { symbol: symbol.toUpperCase() });

      if (!data || data.length === 0) {
        return {
          content: [{ type: "text", text: `No executive information found for symbol: ${symbol}` }]
        };
      }

      const executives = data.map(exec => ({
        name: exec.name,
        title: exec.title,
        pay: exec.pay,
        currencyPay: exec.currencyPay,
        gender: exec.gender,
        yearBorn: exec.yearBorn,
        titleSince: exec.titleSince
      }));

      return {
        content: [{ type: "text", text: JSON.stringify(executives, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error fetching key executives: ${error.message}` }],
        isError: true
      };
    }
  }
);

// Tool 3: Stock Peers - 동종 업계 주식 조회
server.tool(
  "get_stock_peers",
  "Get a list of stock peers (similar companies in the same sector/industry)",
  {
    symbol: z.string().describe("Stock ticker symbol (e.g., AAPL, MSFT, GOOGL)")
  },
  async ({ symbol }) => {
    try {
      const data = await fetchFromFMP(`/stock_peers`, { symbol: symbol.toUpperCase() });

      if (!data || data.length === 0) {
        return {
          content: [{ type: "text", text: `No peers found for symbol: ${symbol}` }]
        };
      }

      return {
        content: [{ type: "text", text: JSON.stringify(data[0], null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error fetching stock peers: ${error.message}` }],
        isError: true
      };
    }
  }
);

// Tool 4: Company Rating - 회사 등급 조회
server.tool(
  "get_company_rating",
  "Get company rating including overall rating, DCF recommendation, ROE, ROA, and other financial metrics ratings",
  {
    symbol: z.string().describe("Stock ticker symbol (e.g., AAPL, MSFT, GOOGL)")
  },
  async ({ symbol }) => {
    try {
      const data = await fetchFromFMP(`/rating`, { symbol: symbol.toUpperCase() });

      if (!data || data.length === 0) {
        return {
          content: [{ type: "text", text: `No rating found for symbol: ${symbol}` }]
        };
      }

      const rating = data[0];
      const result = {
        symbol: rating.symbol,
        date: rating.date,
        rating: rating.rating,
        ratingScore: rating.ratingScore,
        ratingRecommendation: rating.ratingRecommendation,
        ratingDetailsDCFScore: rating.ratingDetailsDCFScore,
        ratingDetailsDCFRecommendation: rating.ratingDetailsDCFRecommendation,
        ratingDetailsROEScore: rating.ratingDetailsROEScore,
        ratingDetailsROERecommendation: rating.ratingDetailsROERecommendation,
        ratingDetailsROAScore: rating.ratingDetailsROAScore,
        ratingDetailsROARecommendation: rating.ratingDetailsROARecommendation,
        ratingDetailsDEScore: rating.ratingDetailsDEScore,
        ratingDetailsDERecommendation: rating.ratingDetailsDERecommendation,
        ratingDetailsPEScore: rating.ratingDetailsPEScore,
        ratingDetailsPERecommendation: rating.ratingDetailsPERecommendation,
        ratingDetailsPBScore: rating.ratingDetailsPBScore,
        ratingDetailsPBRecommendation: rating.ratingDetailsPBRecommendation
      };

      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error fetching company rating: ${error.message}` }],
        isError: true
      };
    }
  }
);

// Tool 5: Company Notes/Description - 회사 설명만 조회
server.tool(
  "get_company_notes",
  "Get company notes and core business description",
  {
    symbol: z.string().describe("Stock ticker symbol (e.g., AAPL, MSFT, GOOGL)")
  },
  async ({ symbol }) => {
    try {
      const data = await fetchFromFMP(`/company-core-information`, { symbol: symbol.toUpperCase() });

      if (!data || data.length === 0) {
        return {
          content: [{ type: "text", text: `No company notes found for symbol: ${symbol}` }]
        };
      }

      return {
        content: [{ type: "text", text: JSON.stringify(data[0], null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error fetching company notes: ${error.message}` }],
        isError: true
      };
    }
  }
);

// Tool 6: Search Company - 회사명/심볼 검색
server.tool(
  "search_company",
  "Search for companies by name or ticker symbol",
  {
    query: z.string().describe("Search query (company name or ticker symbol)"),
    limit: z.number().optional().default(10).describe("Maximum number of results to return (default: 10)")
  },
  async ({ query, limit }) => {
    try {
      const data = await fetchFromFMP(`/search-name`, { query: query, limit: limit });

      if (!data || data.length === 0) {
        return {
          content: [{ type: "text", text: `No companies found for query: ${query}` }]
        };
      }

      const results = data.map(item => ({
        symbol: item.symbol,
        name: item.name,
        currency: item.currency,
        stockExchange: item.stockExchange,
        exchangeShortName: item.exchangeShortName
      }));

      return {
        content: [{ type: "text", text: JSON.stringify(results, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error searching companies: ${error.message}` }],
        isError: true
      };
    }
  }
);

// Tool 7: Income Statement - 손익계산서 조회
server.tool(
  "get_income_statement",
  "Get income statement (profit and loss statement) including revenue, expenses, and net income",
  {
    symbol: z.string().describe("Stock ticker symbol (e.g., AAPL, MSFT, GOOGL)"),
    period: z.enum(["annual", "quarter"]).optional().default("annual").describe("Reporting period: 'annual' or 'quarter' (default: annual)"),
    limit: z.number().optional().default(5).describe("Number of periods to return (default: 5)")
  },
  async ({ symbol, period, limit }) => {
    try {
      const data = await fetchFromFMP(`/income-statement`, {
        symbol: symbol.toUpperCase(),
        period: period,
        limit: limit
      });

      if (!data || data.length === 0) {
        return {
          content: [{ type: "text", text: `No income statement found for symbol: ${symbol}` }]
        };
      }

      const statements = data.map(stmt => ({
        date: stmt.date,
        symbol: stmt.symbol,
        fiscalYear: stmt.fiscalYear,
        period: stmt.period,
        revenue: stmt.revenue,
        costOfRevenue: stmt.costOfRevenue,
        grossProfit: stmt.grossProfit,
        researchAndDevelopmentExpenses: stmt.researchAndDevelopmentExpenses,
        sellingGeneralAndAdministrativeExpenses: stmt.sellingGeneralAndAdministrativeExpenses,
        operatingExpenses: stmt.operatingExpenses,
        operatingIncome: stmt.operatingIncome,
        ebitda: stmt.ebitda,
        ebit: stmt.ebit,
        incomeBeforeTax: stmt.incomeBeforeTax,
        incomeTaxExpense: stmt.incomeTaxExpense,
        netIncome: stmt.netIncome,
        eps: stmt.eps,
        epsDiluted: stmt.epsDiluted,
        weightedAverageShsOut: stmt.weightedAverageShsOut,
        weightedAverageShsOutDil: stmt.weightedAverageShsOutDil
      }));

      return {
        content: [{ type: "text", text: JSON.stringify(statements, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error fetching income statement: ${error.message}` }],
        isError: true
      };
    }
  }
);

// Tool 8: Balance Sheet - 재무상태표 조회
server.tool(
  "get_balance_sheet",
  "Get balance sheet statement including assets, liabilities, and shareholders equity",
  {
    symbol: z.string().describe("Stock ticker symbol (e.g., AAPL, MSFT, GOOGL)"),
    period: z.enum(["annual", "quarter"]).optional().default("annual").describe("Reporting period: 'annual' or 'quarter' (default: annual)"),
    limit: z.number().optional().default(5).describe("Number of periods to return (default: 5)")
  },
  async ({ symbol, period, limit }) => {
    try {
      const data = await fetchFromFMP(`/balance-sheet-statement`, {
        symbol: symbol.toUpperCase(),
        period: period,
        limit: limit
      });

      if (!data || data.length === 0) {
        return {
          content: [{ type: "text", text: `No balance sheet found for symbol: ${symbol}` }]
        };
      }

      const statements = data.map(stmt => ({
        date: stmt.date,
        symbol: stmt.symbol,
        fiscalYear: stmt.fiscalYear,
        period: stmt.period,
        cashAndCashEquivalents: stmt.cashAndCashEquivalents,
        shortTermInvestments: stmt.shortTermInvestments,
        cashAndShortTermInvestments: stmt.cashAndShortTermInvestments,
        netReceivables: stmt.netReceivables,
        inventory: stmt.inventory,
        totalCurrentAssets: stmt.totalCurrentAssets,
        propertyPlantEquipmentNet: stmt.propertyPlantEquipmentNet,
        goodwill: stmt.goodwill,
        intangibleAssets: stmt.intangibleAssets,
        longTermInvestments: stmt.longTermInvestments,
        totalNonCurrentAssets: stmt.totalNonCurrentAssets,
        totalAssets: stmt.totalAssets,
        accountPayables: stmt.accountPayables,
        shortTermDebt: stmt.shortTermDebt,
        totalCurrentLiabilities: stmt.totalCurrentLiabilities,
        longTermDebt: stmt.longTermDebt,
        totalNonCurrentLiabilities: stmt.totalNonCurrentLiabilities,
        totalLiabilities: stmt.totalLiabilities,
        commonStock: stmt.commonStock,
        retainedEarnings: stmt.retainedEarnings,
        totalStockholdersEquity: stmt.totalStockholdersEquity,
        totalEquity: stmt.totalEquity,
        totalLiabilitiesAndStockholdersEquity: stmt.totalLiabilitiesAndStockholdersEquity
      }));

      return {
        content: [{ type: "text", text: JSON.stringify(statements, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error fetching balance sheet: ${error.message}` }],
        isError: true
      };
    }
  }
);

// Tool 9: Cash Flow Statement - 현금흐름표 조회
server.tool(
  "get_cash_flow_statement",
  "Get cash flow statement including operating, investing, and financing activities",
  {
    symbol: z.string().describe("Stock ticker symbol (e.g., AAPL, MSFT, GOOGL)"),
    period: z.enum(["annual", "quarter"]).optional().default("annual").describe("Reporting period: 'annual' or 'quarter' (default: annual)"),
    limit: z.number().optional().default(5).describe("Number of periods to return (default: 5)")
  },
  async ({ symbol, period, limit }) => {
    try {
      const data = await fetchFromFMP(`/cash-flow-statement`, {
        symbol: symbol.toUpperCase(),
        period: period,
        limit: limit
      });

      if (!data || data.length === 0) {
        return {
          content: [{ type: "text", text: `No cash flow statement found for symbol: ${symbol}` }]
        };
      }

      const statements = data.map(stmt => ({
        date: stmt.date,
        symbol: stmt.symbol,
        fiscalYear: stmt.fiscalYear,
        period: stmt.period,
        netIncome: stmt.netIncome,
        depreciationAndAmortization: stmt.depreciationAndAmortization,
        stockBasedCompensation: stmt.stockBasedCompensation,
        changeInWorkingCapital: stmt.changeInWorkingCapital,
        netCashProvidedByOperatingActivities: stmt.netCashProvidedByOperatingActivities,
        investmentsInPropertyPlantAndEquipment: stmt.investmentsInPropertyPlantAndEquipment,
        acquisitionsNet: stmt.acquisitionsNet,
        purchasesOfInvestments: stmt.purchasesOfInvestments,
        salesMaturitiesOfInvestments: stmt.salesMaturitiesOfInvestments,
        netCashProvidedByInvestingActivities: stmt.netCashProvidedByInvestingActivities,
        netDebtIssuance: stmt.netDebtIssuance,
        netStockIssuance: stmt.netStockIssuance,
        commonStockRepurchased: stmt.commonStockRepurchased,
        commonDividendsPaid: stmt.commonDividendsPaid,
        netCashProvidedByFinancingActivities: stmt.netCashProvidedByFinancingActivities,
        netChangeInCash: stmt.netChangeInCash,
        cashAtEndOfPeriod: stmt.cashAtEndOfPeriod,
        cashAtBeginningOfPeriod: stmt.cashAtBeginningOfPeriod,
        operatingCashFlow: stmt.operatingCashFlow,
        capitalExpenditure: stmt.capitalExpenditure,
        freeCashFlow: stmt.freeCashFlow
      }));

      return {
        content: [{ type: "text", text: JSON.stringify(statements, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error fetching cash flow statement: ${error.message}` }],
        isError: true
      };
    }
  }
);

// Tool 10: Financial Ratios - 재무비율 조회
server.tool(
  "get_financial_ratios",
  "Get key financial ratios including profitability, liquidity, debt, and valuation ratios",
  {
    symbol: z.string().describe("Stock ticker symbol (e.g., AAPL, MSFT, GOOGL)"),
    period: z.enum(["annual", "quarter"]).optional().default("annual").describe("Reporting period: 'annual' or 'quarter' (default: annual)"),
    limit: z.number().optional().default(5).describe("Number of periods to return (default: 5)")
  },
  async ({ symbol, period, limit }) => {
    try {
      const data = await fetchFromFMP(`/ratios`, {
        symbol: symbol.toUpperCase(),
        period: period,
        limit: limit
      });

      if (!data || data.length === 0) {
        return {
          content: [{ type: "text", text: `No financial ratios found for symbol: ${symbol}` }]
        };
      }

      const ratios = data.map(r => ({
        date: r.date,
        symbol: r.symbol,
        period: r.period,
        currentRatio: r.currentRatio,
        quickRatio: r.quickRatio,
        cashRatio: r.cashRatio,
        grossProfitMargin: r.grossProfitMargin,
        operatingProfitMargin: r.operatingProfitMargin,
        netProfitMargin: r.netProfitMargin,
        returnOnAssets: r.returnOnAssets,
        returnOnEquity: r.returnOnEquity,
        returnOnCapitalEmployed: r.returnOnCapitalEmployed,
        debtRatio: r.debtRatio,
        debtEquityRatio: r.debtEquityRatio,
        priceEarningsRatio: r.priceEarningsRatio,
        priceToBookRatio: r.priceToBookRatio,
        priceToSalesRatio: r.priceToSalesRatio,
        enterpriseValueMultiple: r.enterpriseValueMultiple,
        priceFairValue: r.priceFairValue,
        dividendYield: r.dividendYield,
        payoutRatio: r.payoutRatio
      }));

      return {
        content: [{ type: "text", text: JSON.stringify(ratios, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error fetching financial ratios: ${error.message}` }],
        isError: true
      };
    }
  }
);

// Tool 11: Key Metrics - 핵심 지표 조회
server.tool(
  "get_key_metrics",
  "Get key financial metrics including market cap, enterprise value, PE ratio, and per share values",
  {
    symbol: z.string().describe("Stock ticker symbol (e.g., AAPL, MSFT, GOOGL)"),
    period: z.enum(["annual", "quarter"]).optional().default("annual").describe("Reporting period: 'annual' or 'quarter' (default: annual)"),
    limit: z.number().optional().default(5).describe("Number of periods to return (default: 5)")
  },
  async ({ symbol, period, limit }) => {
    try {
      const data = await fetchFromFMP(`/key-metrics`, {
        symbol: symbol.toUpperCase(),
        period: period,
        limit: limit
      });

      if (!data || data.length === 0) {
        return {
          content: [{ type: "text", text: `No key metrics found for symbol: ${symbol}` }]
        };
      }

      const metrics = data.map(m => ({
        date: m.date,
        symbol: m.symbol,
        period: m.period,
        revenuePerShare: m.revenuePerShare,
        netIncomePerShare: m.netIncomePerShare,
        operatingCashFlowPerShare: m.operatingCashFlowPerShare,
        freeCashFlowPerShare: m.freeCashFlowPerShare,
        cashPerShare: m.cashPerShare,
        bookValuePerShare: m.bookValuePerShare,
        tangibleBookValuePerShare: m.tangibleBookValuePerShare,
        shareholdersEquityPerShare: m.shareholdersEquityPerShare,
        interestDebtPerShare: m.interestDebtPerShare,
        marketCap: m.marketCap,
        enterpriseValue: m.enterpriseValue,
        peRatio: m.peRatio,
        priceToSalesRatio: m.priceToSalesRatio,
        pbRatio: m.pbRatio,
        evToSales: m.evToSales,
        evToOperatingCashFlow: m.evToOperatingCashFlow,
        evToFreeCashFlow: m.evToFreeCashFlow,
        earningsYield: m.earningsYield,
        freeCashFlowYield: m.freeCashFlowYield,
        debtToEquity: m.debtToEquity,
        debtToAssets: m.debtToAssets,
        netDebtToEBITDA: m.netDebtToEBITDA,
        currentRatio: m.currentRatio,
        roe: m.roe,
        roic: m.roic
      }));

      return {
        content: [{ type: "text", text: JSON.stringify(metrics, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error fetching key metrics: ${error.message}` }],
        isError: true
      };
    }
  }
);

// Tool 12: Stock Chart Light - 간단한 주가 차트 (종가, 거래량만)
server.tool(
  "get_stock_chart_light",
  "Get lightweight stock chart with closing price and volume only (End of Day)",
  {
    symbol: z.string().describe("Stock ticker symbol (e.g., AAPL, MSFT, GOOGL)"),
    from: z.string().optional().describe("Start date in YYYY-MM-DD format"),
    to: z.string().optional().describe("End date in YYYY-MM-DD format")
  },
  async ({ symbol, from, to }) => {
    try {
      const params = { symbol: symbol.toUpperCase() };
      if (from) params.from = from;
      if (to) params.to = to;

      const data = await fetchFromFMP(`/historical-price-eod/light`, params);

      if (!data || data.length === 0) {
        return {
          content: [{ type: "text", text: `No chart data found for symbol: ${symbol}` }]
        };
      }

      const chartData = data.slice(0, 30).map(item => ({
        date: item.date,
        price: item.price,
        volume: item.volume
      }));

      return {
        content: [{ type: "text", text: JSON.stringify(chartData, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error fetching stock chart: ${error.message}` }],
        isError: true
      };
    }
  }
);

// Tool 13: Stock Price and Volume - OHLCV 데이터
server.tool(
  "get_stock_price_volume",
  "Get full stock price data with Open, High, Low, Close, Volume (OHLCV) - End of Day",
  {
    symbol: z.string().describe("Stock ticker symbol (e.g., AAPL, MSFT, GOOGL)"),
    from: z.string().optional().describe("Start date in YYYY-MM-DD format"),
    to: z.string().optional().describe("End date in YYYY-MM-DD format")
  },
  async ({ symbol, from, to }) => {
    try {
      const params = { symbol: symbol.toUpperCase() };
      if (from) params.from = from;
      if (to) params.to = to;

      const data = await fetchFromFMP(`/historical-price-eod/full`, params);

      if (!data || data.length === 0) {
        return {
          content: [{ type: "text", text: `No price data found for symbol: ${symbol}` }]
        };
      }

      const priceData = data.slice(0, 30).map(item => ({
        date: item.date,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume,
        change: item.change,
        changePercent: item.changePercent,
        vwap: item.vwap
      }));

      return {
        content: [{ type: "text", text: JSON.stringify(priceData, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error fetching price data: ${error.message}` }],
        isError: true
      };
    }
  }
);

// Tool 14: Dividend Adjusted Price - 배당 조정 주가
server.tool(
  "get_dividend_adjusted_price",
  "Get dividend-adjusted stock price data (adjusted for dividends and splits)",
  {
    symbol: z.string().describe("Stock ticker symbol (e.g., AAPL, MSFT, GOOGL)"),
    from: z.string().optional().describe("Start date in YYYY-MM-DD format"),
    to: z.string().optional().describe("End date in YYYY-MM-DD format")
  },
  async ({ symbol, from, to }) => {
    try {
      const params = { symbol: symbol.toUpperCase() };
      if (from) params.from = from;
      if (to) params.to = to;

      const data = await fetchFromFMP(`/historical-price-eod/dividend-adjusted`, params);

      if (!data || data.length === 0) {
        return {
          content: [{ type: "text", text: `No adjusted price data found for symbol: ${symbol}` }]
        };
      }

      const adjustedData = data.slice(0, 30).map(item => ({
        date: item.date,
        adjOpen: item.adjOpen,
        adjHigh: item.adjHigh,
        adjLow: item.adjLow,
        adjClose: item.adjClose,
        volume: item.volume
      }));

      return {
        content: [{ type: "text", text: JSON.stringify(adjustedData, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error fetching adjusted price: ${error.message}` }],
        isError: true
      };
    }
  }
);

// Tool 15: Intraday Chart - 장중 차트 (유료 플랜 전용)
server.tool(
  "get_intraday_chart",
  "Get intraday stock chart data (1min, 5min, 15min, 30min, 1hour, 4hour intervals) - Requires paid plan",
  {
    symbol: z.string().describe("Stock ticker symbol (e.g., AAPL, MSFT, GOOGL)"),
    interval: z.enum(["1min", "5min", "15min", "30min", "1hour", "4hour"]).describe("Time interval for the chart"),
    from: z.string().optional().describe("Start datetime in YYYY-MM-DD or YYYY-MM-DD HH:MM:SS format"),
    to: z.string().optional().describe("End datetime in YYYY-MM-DD or YYYY-MM-DD HH:MM:SS format")
  },
  async ({ symbol, interval, from, to }) => {
    try {
      const params = { symbol: symbol.toUpperCase() };
      if (from) params.from = from;
      if (to) params.to = to;

      const data = await fetchFromFMP(`/historical-chart/${interval}`, params);

      if (typeof data === 'string' && data.includes('Restricted')) {
        return {
          content: [{ type: "text", text: `Intraday data requires a paid FMP subscription. This endpoint is not available on the free plan.` }]
        };
      }

      if (!data || data.length === 0) {
        return {
          content: [{ type: "text", text: `No intraday data found for symbol: ${symbol}` }]
        };
      }

      const intradayData = data.slice(0, 50).map(item => ({
        date: item.date,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume
      }));

      return {
        content: [{ type: "text", text: JSON.stringify(intradayData, null, 2) }]
      };
    } catch (error) {
      if (error.message.includes('403')) {
        return {
          content: [{ type: "text", text: `Intraday data requires a paid FMP subscription.` }],
          isError: true
        };
      }
      return {
        content: [{ type: "text", text: `Error fetching intraday chart: ${error.message}` }],
        isError: true
      };
    }
  }
);

// 서버 시작
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("FMP MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
