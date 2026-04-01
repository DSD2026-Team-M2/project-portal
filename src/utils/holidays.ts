import type { SupportedLanguage } from "../i18n/language";
import { resolveLocalizedText, type LocalizedText } from "./content";

const text = (en: string, zhCN: string, pt: string): LocalizedText => ({
  en,
  "zh-CN": zhCN,
  pt,
});

const holidayCopy: Record<string, { title: LocalizedText; summary: LocalizedText }> = {
  "New Year's Day": {
    title: text("New Year's Day", "元旦", "Ano Novo"),
    summary: text("New Year's Day", "元旦", "Ano Novo"),
  },
  "Chinese New Year (Spring Festival)": {
    title: text("Chinese New Year", "春节", "Ano Novo Chinês"),
    summary: text("Chinese New Year", "春节", "Ano Novo Chinês"),
  },
  "Labour Day": {
    title: text("Labour Day", "劳动节", "Dia do Trabalhador"),
    summary: text("Labour Day", "劳动节", "Dia do Trabalhador"),
  },
  "Dragon Boat Festival": {
    title: text("Dragon Boat Festival", "端午节", "Festival do Barco-Dragão"),
    summary: text("Dragon Boat Festival", "端午节", "Festival do Barco-Dragão"),
  },
  "Mid-Autumn Festival": {
    title: text("Mid-Autumn Festival", "中秋节", "Festival do Meio Outono"),
    summary: text("Mid-Autumn Festival", "中秋节", "Festival do Meio Outono"),
  },
  "National Day": {
    title: text("National Day", "国庆日", "Dia Nacional"),
    summary: text("National Day", "国庆日", "Dia Nacional"),
  },
  Carnival: {
    title: text("Carnival", "狂欢节", "Carnaval"),
    summary: text("Carnival", "狂欢节", "Carnaval"),
  },
  "Good Friday": {
    title: text("Good Friday", "耶稣受难日", "Sexta-feira Santa"),
    summary: text("Good Friday", "耶稣受难日", "Sexta-feira Santa"),
  },
  "Easter Sunday": {
    title: text("Easter Sunday", "复活节", "Domingo de Páscoa"),
    summary: text("Easter Sunday", "复活节", "Domingo de Páscoa"),
  },
  "Freedom Day": {
    title: text("Freedom Day", "自由日", "Dia da Liberdade"),
    summary: text("Freedom Day", "自由日", "Dia da Liberdade"),
  },
  "Azores Day": {
    title: text("Azores Day", "亚速尔日", "Dia dos Açores"),
    summary: text("Azores Day", "亚速尔日", "Dia dos Açores"),
  },
  "Corpus Christi": {
    title: text("Corpus Christi", "圣体节", "Corpo de Deus"),
    summary: text("Corpus Christi", "圣体节", "Corpo de Deus"),
  },
  "Madeira Day": {
    title: text("Madeira Day", "马德拉日", "Dia da Madeira"),
    summary: text("Madeira Day", "马德拉日", "Dia da Madeira"),
  },
  "Assumption Day": {
    title: text("Assumption Day", "圣母升天节", "Assunção de Nossa Senhora"),
    summary: text("Assumption Day", "圣母升天节", "Assunção de Nossa Senhora"),
  },
  "Republic Day": {
    title: text("Republic Day", "共和国日", "Implantação da República"),
    summary: text("Republic Day", "共和国日", "Implantação da República"),
  },
  "All Saints Day": {
    title: text("All Saints Day", "诸圣节", "Dia de Todos-os-Santos"),
    summary: text("All Saints Day", "诸圣节", "Dia de Todos-os-Santos"),
  },
  "Restoration of Independence": {
    title: text("Restoration of Independence", "独立恢复日", "Restauração da Independência"),
    summary: text("Restoration of Independence", "独立恢复日", "Restauração da Independência"),
  },
  "Immaculate Conception": {
    title: text("Immaculate Conception", "圣母无染原罪瞻礼", "Imaculada Conceição"),
    summary: text("Immaculate Conception", "圣母无染原罪瞻礼", "Imaculada Conceição"),
  },
  "Christmas Day": {
    title: text("Christmas Day", "圣诞节", "Natal"),
    summary: text("Christmas Day", "圣诞节", "Natal"),
  },
  "St. Stephen's Day": {
    title: text("St. Stephen's Day", "圣司提反日", "Primeira Oitava"),
    summary: text("St. Stephen's Day", "圣司提反日", "Primeira Oitava"),
  },
};

export function localizeHolidayCopy(title: string, summary: string, language: SupportedLanguage) {
  const copy = holidayCopy[summary];

  if (!copy) {
    return {
      title: language === "en" ? summary : title,
      summary: language === "en" ? summary : title,
    };
  }

  return {
    title: resolveLocalizedText(copy.title, language),
    summary: resolveLocalizedText(copy.summary, language),
  };
}
