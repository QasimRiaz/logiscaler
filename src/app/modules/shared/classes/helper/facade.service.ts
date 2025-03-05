// import { inject, Injectable, Injector } from "@angular/core";
// import { PersonnelUsecases } from "../usecases/user/user.usecases";
// import { Personnel, branch, UserPosition, region, UserRole, subRegion } from "../../models/user.model";
// import { CountryRepository } from "../repository/country.repository";
// import { GetRegionByCountryUsecase } from "../usecases/region/region.usecase";
// import { CustomerUsecases } from "../usecases/customers/customers.usecases";
// import { Branch, Country, Customer, CustomerSubRegion, Region, SubRegion, SubRegionChannel, TradeChannel, TradeChannelConfig } from "../../models/country.model";
// import { TradeChannelUsecases } from "../usecases/tradeChannel/tradeChannel.usecases";
// import { GetAllCountriesUsecase } from "../usecases/countries/countries.usecase";
// import { BranchUsecase } from "../usecases/branches/branch.usecase";
// import { Category, Item, ItemAssignment, Varaint } from "../../models/category.model";
// import { CategoryUsecases } from "../usecases/category/category.usecases";
// import { Objective } from "../../models/objective.model";
// import { ObjectiveUsecases } from "../usecases/objective/objective.usecases";
// import { PlanogramUsecases } from "../usecases/planogram/planogram.usecases";
// import { Planogram, PlanogramTradeChannel } from "../../models/planogram.model";
// import { Brand, CompetitorItem, CompetitorVariant } from "../../models/brand.model";
// import { BrandUsecases } from "../usecases/brands/brand.usecases";
// import { DocumentUsecase } from "../usecases/document/document.usecase";
// import { DocumentFile } from "../../models/folder.model";
// import { NoteUsecases } from "../usecases/notes/note.usecases";
// import { Note } from "../../models/note.model";
// import { BranchAssignemnt, CategoryAssignemnt, CountryAssignemnt, CustomerAssignemnt, DisplayAssignment, PositionAssignment, RegionAssignemnt, SubRegionAssignemnt, TradeChannelAssignemnt, UserAssignment } from "../../models/assignments.model";
// import { ContractUsecases } from "../usecases/contract/contract.usecases";
// import { Contract } from "../../models/contract.model";
// import { QuestionnaryUsecases } from "../usecases/questionnary/questionnary.usecases";
// import { Questionnary } from "../../models/questionnary.model";
// import { MarketingCampaignUsecases } from "../usecases/marketingCampaign/marketingCampaign.usecases";
// import { MarketingCampaign } from "../../models/marketingCampaign.model";
// import { MonthlyBrandingUsecases } from "../usecases/monthlyBranding/monthlyBranding.usecases";
// import { MonthlyBranding } from "../../models/monthlyBranding.model";
// import { AlalaliPromoUsecases } from "../usecases/alalaliPromo/alalaliPromo.usecases";
// import { AlalaliPromotion } from "../../models/alalaliPromo.model";
// import { ContactUsUsecases } from "../usecases/contactUs/contactUs.usecases";
// import { ContactUs } from "../../models/contactUs.model";
// import { NotificationUsecases } from "../usecases/notification/notification.usecases";
// import { Notification } from "../../models/notification.model";
// import { CompetitorPromotionUsecases } from "../usecases/competitorPromotion/competitorPromotion.usecases";
// import { CompetitorPromotion } from "../../models/competitorPromotion.model";
// import { AchievmentFormUsecases } from "../usecases/achievmentForm/achievmentForm.usecases";
// import { AchievmentForm } from "../../models/achievmentForm.model";
// import { NewProductLaunchUsecases } from "../usecases/newProductLaunch/newProductLaunch.usecases";
// import { NewProductLaunch } from "../../models/newProductLaunch.mode";
// import { MonthlyEvaluationUsecases } from "../usecases/monthlyEvaluation/monthlyEvaluation.usecases";
// import { MonthlyEvaluation } from "../../models/monthlies.model";
// import { YearlyEvaluationUsecases } from "../usecases/yearlyEvaluation/yearlyEvaluation.usecases";
// import { PersonalSkill, PlanningAndOrganizationSkill, Reporting, SellingSkill, YearlyEvaluation } from "../../models/yearlies.model";
// import { PriceSurveyUsecases } from "../usecases/priceSurvey/priceSurvey.usecases";
// import { ShelfShareUsecases } from "../usecases/shelfShare/shelfShare.usecases";

// @Injectable({
//     providedIn: "root",
// })
// export class FacadeService {

//     private personnelService = inject(PersonnelUsecases);
//     private regionService = inject(GetRegionByCountryUsecase);
//     private customerService = inject(CustomerUsecases);
//     private tradeChannelService = inject(TradeChannelUsecases);
//     private countryService = inject(GetAllCountriesUsecase);
//     private branchService = inject(BranchUsecase);
//     private categoryService = inject(CategoryUsecases);
//     private objectiveService = inject(ObjectiveUsecases);
//     private planoService = inject(PlanogramUsecases);
//     private brandService = inject(BrandUsecases);
//     private documentService = inject(DocumentUsecase);
//     private noteService = inject(NoteUsecases);
//     private contractService = inject(ContractUsecases);
//     private questionnaireService = inject(QuestionnaryUsecases);
//     private campaignService = inject(MarketingCampaignUsecases);
//     private monthlyBrandingService = inject(MonthlyBrandingUsecases);
//     private promotionService = inject(AlalaliPromoUsecases);
//     private contactService = inject(ContactUsUsecases);
//     private notificationService = inject(NotificationUsecases);
//     private competitorPromotionService = inject(CompetitorPromotionUsecases);
//     private achievmentFormService = inject(AchievmentFormUsecases);
//     private newProductService = inject(NewProductLaunchUsecases);
//     private monthlyEvaluationService = inject(MonthlyEvaluationUsecases);
//     private yearlyEvaluationService = inject(YearlyEvaluationUsecases);
//     private priceSurveyService = inject(PriceSurveyUsecases);
//     private shelfShareService = inject(ShelfShareUsecases);

//     constructor() { }

//     checkUserEmail(id: string) {
//         return this.personnelService.execute(id);
//     }
//     updatePersonnel(personnel: Personnel, userRole?: UserRole, userPosition?: UserPosition, region?: region[], subRegion?: subRegion[], branch?: branch[]) {
//         return this.personnelService.executeUpdate(personnel, userRole, userPosition, region, subRegion, branch);
//     }
//     archivePersonnels(ids: string[], archive: boolean) {
//         return this.personnelService.archivePersonnels(ids, archive);
//     }
//     addSupervisor(id: string, userId: string) {
//         return this.personnelService.addSupervisor(id, userId);
//     }
//     archivePlanogram(ids: string[], archive: boolean) {
//         return this.planoService.archivePlanogram(ids, archive);
//     }
//     archiveTradeChannel(ids: string[], archive: boolean) {
//         return this.tradeChannelService.archiveTradeChannel(ids, archive);
//     }
//     archiveCustomer(ids: string[], archive: boolean) {
//         return this.customerService.archiveCustomer(ids, archive);
//     }
//     updateCustomer(customer: Customer, customerSubRegions: CustomerSubRegion[],) {
//         return this.customerService.executeUpdate(customer, customerSubRegions);
//     }
//     updateTradeChannel(tradeChannel: TradeChannel, tradeChannelSubRegions: SubRegionChannel[]) {
//         return this.tradeChannelService.executeUpdate(tradeChannel, tradeChannelSubRegions);
//     }
//     getTradeChannelsBySubRegions(id: string[]) {
//         return this.tradeChannelService.executeTradeChannelsBySubRegions(id);
//     }
//     getTradeChannelsBySubRegion(id: string) {
//         return this.tradeChannelService.executeTradeChannelsBySubRegion(id);
//     }
//     getAllTradeChannels(archive: boolean) {
//         return this.tradeChannelService.execute(archive);
//     }
//     getConfigByTradeChannels(id: string[]) {
//         return this.tradeChannelService.executeConfigByTradeChannels(id);
//     }
//     getItemByTradeChannels(countryId: string, id: string[]) {
//         return this.categoryService.getItemByTradeChannels(countryId, id);
//     }
//     getVariantsByBrandCategory(brandId: string, categoryId: string) {
//         return this.brandService.getVariantsByBrandCategory(brandId, categoryId);
//     }
//     getCustomersBySubRegionsChannel(subRegionId: string[], tradeChannelId: string) {
//         return this.customerService.executeCustomersBySubRegionsChannel(subRegionId, tradeChannelId)
//     }
//     getCustomersBySubRegionsChannels(subRegionId: any, tradeChannelId: string[]) {
//         return this.customerService.executeCustomersBySubRegionsChannels(subRegionId, tradeChannelId)
//     }
//     getQuestionnaireBySubRegionsChannelsCustomer(subRegionId: any, tradeChannelId: any, customerId: string[], surveyQuestion: boolean) {
//         return this.questionnaireService.getQuestionnaireBySubRegionsChannelsCustomer(subRegionId, tradeChannelId, customerId, surveyQuestion)
//     }
//     updateItem(item: Item) {
//         return this.categoryService.executeUpdate(item);
//     }
//     updateCompetitorItem(item: CompetitorItem) {
//         return this.brandService.executeUpdate(item);
//     }
//     updateObj(obj: Objective, files: File[]) {
//         return this.objectiveService.executeUpdate(obj, files);
//     }
//     updateContract(obj: Contract, regionAssignment: RegionAssignemnt[], subRegionAssignment: SubRegionAssignemnt[], tradeChannelAssignemnt: TradeChannelAssignemnt[], customerAssignemnt: CustomerAssignemnt[], branchAssignemnt: BranchAssignemnt[], categoryAssignemnt?: CategoryAssignemnt[], files?: File[]) {
//         return this.contractService.executeUpdate(obj, regionAssignment, subRegionAssignment, tradeChannelAssignemnt, customerAssignemnt, branchAssignemnt, categoryAssignemnt, files);
//     }
//     updateCampaign(obj: MarketingCampaign,
//         regionAssignment: RegionAssignemnt[],
//         subRegionAssignment: SubRegionAssignemnt[],
//         tradeChannelAssignemnt: TradeChannelAssignemnt[],
//         customerAssignemnt: CustomerAssignemnt[],
//         branchAssignemnt: BranchAssignemnt[],
//         categoryAssignemnt?: CategoryAssignemnt[],
//         displayAssignment?: DisplayAssignment[],
//         files?: File[]) {
//         return this.campaignService.executeUpdate(obj, regionAssignment, subRegionAssignment, tradeChannelAssignemnt, customerAssignemnt, branchAssignemnt, categoryAssignemnt, displayAssignment, files);
//     }
//     updatePromotion(obj: AlalaliPromotion,
//         regionAssignment: RegionAssignemnt[],
//         subRegionAssignment: SubRegionAssignemnt[],
//         tradeChannelAssignemnt: TradeChannelAssignemnt[],
//         customerAssignemnt: CustomerAssignemnt[],
//         branchAssignemnt: BranchAssignemnt[],
//         displayAssignment?: DisplayAssignment[],
//         files?: File[]) {
//         return this.promotionService.executeUpdate(obj, regionAssignment, subRegionAssignment, tradeChannelAssignemnt, customerAssignemnt, branchAssignemnt, displayAssignment, files);
//     }
//     updateCompetitorPromotion(obj: CompetitorPromotion, displayAssignment?: DisplayAssignment[], files?: File[]) {
//         return this.competitorPromotionService.executeUpdate(obj, displayAssignment, files);
//     }
//     updateBranding(obj: MonthlyBranding,
//         categoryAssignemnt?: CategoryAssignemnt[],
//         displayAssignment?: DisplayAssignment[],
//         files?: File[]) {
//         return this.monthlyBrandingService.executeUpdate(obj, categoryAssignemnt, displayAssignment, files);
//     }
//     updateNote(obj: Note, files: File[]) {
//         return this.noteService.executeUpdate(obj, files);
//     }
//     updateAchivementForm(obj: AchievmentForm, files?: File[]) {
//         return this.achievmentFormService.executeUpdate(obj, files);
//     }
//     updateNewProductLaunch(obj: NewProductLaunch, displayAssignment?: DisplayAssignment[], files?: File[]) {
//         return this.newProductService.executeUpdate(obj, displayAssignment, files);
//     }
//     updateContact(obj: ContactUs, files: File[]) {
//         return this.contactService.executeUpdate(obj, files);
//     }
//     updateMonthlyEvaluation(obj: MonthlyEvaluation) {
//         return this.monthlyEvaluationService.executeUpdate(obj);
//     }
//     updateYearlyEvaluation(obj: YearlyEvaluation, planningAndOrganizationSkills: PlanningAndOrganizationSkill, sellingSkills: SellingSkill, reporting: Reporting, personalSkills: PersonalSkill) {
//         return this.yearlyEvaluationService.executeUpdate(obj, planningAndOrganizationSkills, sellingSkills, reporting, personalSkills);
//     }
//     updateNotification(obj: Notification,
//         countryAssignemnt: CountryAssignemnt[],
//         regionAssignment: RegionAssignemnt[],
//         subRegionAssignment: SubRegionAssignemnt[],
//         tradeChannelAssignemnt: TradeChannelAssignemnt[],
//         customerAssignemnt: CustomerAssignemnt[],
//         branchAssignemnt: BranchAssignemnt[],
//         positionAssignemnt: PositionAssignment[],
//         recipients: UserAssignment[],
//         files?: File[]) {
//         return this.notificationService.executeUpdate(obj,
//             countryAssignemnt,
//             regionAssignment,
//             subRegionAssignment,
//             tradeChannelAssignemnt,
//             customerAssignemnt,
//             branchAssignemnt,
//             positionAssignemnt,
//             recipients, files);
//     }
//     updateDocument(obj: DocumentFile, files: File[]) {
//         return this.documentService.updateDocument(obj, files);
//     }
//     updatePlanogram(plano: Planogram, planogramTradeChannel: PlanogramTradeChannel[], file: any) {
//         return this.planoService.executeUpdate(plano, planogramTradeChannel, file);
//     }
//     createUserInFireBase(email: string, password: string) {
//         return this.personnelService.executeCreateUserInFireBase(email, password);
//     }
//     getRegionByCountry(countryId: string[]) {
//         return this.regionService.getRegionByCountry(countryId);
//     }
//     // getSubRegionsByCountry(countryId: string[]) {
//     //     return this.regionService.getSubRegionsByCountry(countryId);
//     // }
//     // getCustomerByCountry(countryId: string[]) {
//     //     return this.regionService.getRegionByCountry(countryId);
//     // }
//     // getBranchesByCountry(countryId: string[]) {
//     //     return this.regionService.getRegionByCountry(countryId);
//     // }
//     getPersonnelsByCountryId(id: string | string[]) {
//         return this.personnelService.getPersonnelsByCountryId(id);
//     }
//     getQuestionnaireByCountryId(id: string[], surveyQuestion: boolean) {
//         return this.questionnaireService.getQuestionnaireByCountryId(id, surveyQuestion);
//     }
//     getQuestionnaireByRegionId(id: string[], surveyQuestion: boolean) {
//         return this.questionnaireService.getQuestionnaireByRegionId(id, surveyQuestion);
//     }
//     getQuestionnaireByBranchId(id: string[], surveyQuestion: boolean) {
//         return this.questionnaireService.getQuestionnaireByBranchId(id, surveyQuestion);
//     }
//     getQuestionnaireBySubRegionId(id: string[], surveyQuestion: boolean) {
//         return this.questionnaireService.getQuestionnaireBySubRegionId(id, surveyQuestion);
//     }
//     getQuestionnaireBySubRegionsChannels(subRegionIds: any, tradeChannelIds: string[], surveyQuestion: boolean) {
//         return this.questionnaireService.getQuestionnaireBySubRegionsChannels(subRegionIds, tradeChannelIds, surveyQuestion);
//     }
//     getPersonnelsByRegionId(id: string | string[]) {
//         return this.personnelService.getPersonnelsByRegionId(id);
//     }
//     getPersonnelsBySubRegionId(id: string | string[]) {
//         return this.personnelService.getPersonnelsBySubRegionId(id);
//     }
//     getPersonnelsByBranchId(id: string | string[]) {
//         return this.personnelService.getPersonnelsByBranchId(id);
//     }
//     getPersonnelsByPosition(id: string | string[]) {
//         return this.personnelService.getPersonnelsByPosition(id);
//     }
//     getSubRegionByRegion(countryId: string[]) {
//         return this.regionService.getSubRegionByRegion(countryId);
//     }
//     getBranchesbySubRegion(subRegionId: string[]) {
//         return this.branchService.getBranchesbySubRegion(subRegionId);
//     }
//     getBranchesByCustomerTradeRegion(customerId: string[], tradeChannelId: any, subRegionId: any) {
//         return this.branchService.getBranchesByCustomerTradeRegion(customerId, tradeChannelId, subRegionId);
//     }
//     getAllSubRegions() {
//         return this.regionService.getAllSubRegions();
//     }
//     createCountry(country: Country, file: any) {
//         return this.countryService.createCountry(country, file);
//     }
//     deleteCountry(id: string) {
//         return this.countryService.deleteCountry(id);
//     }
//     deleteRegion(id: string) {
//         return this.regionService.deleteRegion(id);
//     }
//     deleteSubRegion(id: string) {
//         return this.regionService.deleteRegion(id);
//     }
//     deleteBranch(id: string) {
//         return this.branchService.deleteBranch(id);
//     }
//     deleteItem(item: Item) {
//         return this.categoryService.deleteItem(item);
//     }
//     deleteObjective(id: string) {
//         return this.objectiveService.deleteObjective(id);
//     }
//     getSubObjectives(id: string) {
//         return this.objectiveService.getSubObjectives(id);
//     }
//     deleteContract(id: string) {
//         return this.contractService.deleteContract(id);
//     }
//     deleteMarketingCampaign(id: string) {
//         return this.campaignService.deleteMarketingCampaign(id);
//     }
//     deleteMonthlyBranding(id: string) {
//         return this.monthlyBrandingService.deleteMonthlyBranding(id);
//     }
//     deleteAchievmentForm(id: string) {
//         return this.achievmentFormService.deleteAchievmentForm(id);
//     }
//     deleteNewProductLaunch(id: string) {
//         return this.newProductService.deleteNewProductLaunch(id);
//     }
//     deleteAlalaliPromotion(id: string) {
//         return this.promotionService.deleteAlalaliPromotion(id);
//     }
//     deleteNote(id: string) {
//         return this.noteService.deleteNote(id);
//     }
//     deleteAnswer(id: string) {
//         return this.questionnaireService.deleteAnswer(id);
//     }
//     deleteQuestionnaire(id: string) {
//         return this.questionnaireService.deleteQuestionnaire(id);
//     }
//     deleteDocument(item: DocumentFile) {
//         return this.documentService.deleteDocument(item);
//     }
//     deletePlanogram(id: string) {
//         return this.planoService.deletePlanogram(id);
//     }
//     deleteVariant(variant: Varaint) {
//         return this.categoryService.deleteVariant(variant);
//     }
//     deleteCVariant(variant: CompetitorVariant) {
//         return this.brandService.deleteCVariant(variant);
//     }
//     deletePriceSurvey(id: string) {
//         return this.priceSurveyService.delete(id);
//     }
//     deleteConfiguration(config: TradeChannelConfig) {
//         return this.tradeChannelService.deleteConfiguration(config);
//     }
//     deleteCategory(cat: Category) {
//         return this.categoryService.deleteCategory(cat);
//     }
//     deleteBrand(brand: Brand) {
//         return this.brandService.deleteBrand(brand);
//     }
//     markCountryActive(country: Country, regionIds: string[], subRegionIds: string[]) {
//         return this.countryService.markCountryActive(country, regionIds, subRegionIds);
//     }
//     markCountryDisable(country: Country, regionIds: string[], subRegionIds: string[]) {
//         return this.countryService.markCountryDisable(country, regionIds, subRegionIds);
//     }
//     markRegionActive(id: string, subRegionIds: string[]) {
//         return this.regionService.markRegionActive(id, subRegionIds);
//     }
//     markBranchActive(id: string) {
//         return this.branchService.markBranchActive(id);
//     }
//     markBranchDisable(id: string) {
//         return this.branchService.markBranchDisable(id);
//     }
//     markRegionDisable(id: string, subRegionIds: string[]) {
//         return this.regionService.markRegionDisable(id, subRegionIds);
//     }
//     markSubRegionActive(id: string, subRegionIds: string[]) {
//         return this.regionService.markSubRegionActive(id, subRegionIds);
//     }
//     markSubRegionDisable(id: string, subRegionIds: string[]) {
//         return this.regionService.markSubRegionDisable(id, subRegionIds);
//     }
//     createRegion(region: Region) {
//         return this.regionService.createRegion(region);
//     }
//     createSubRegion(subRegion: SubRegion) {
//         return this.regionService.createSubRegion(subRegion);
//     }
//     createBranch(branch: Branch) {
//         return this.branchService.createBranch(branch);
//     }
//     createQuestionnaire(questionnaire: Questionnary, countryAssignemnt: CountryAssignemnt[], regionAssignment: RegionAssignemnt[], subRegionAssignment: SubRegionAssignemnt[], tradeChannelAssignemnt: TradeChannelAssignemnt[], customerAssignemnt: CustomerAssignemnt[], branchAssignemnt: BranchAssignemnt[], positionAssignemnt: PositionAssignment[], userAssignment: UserAssignment[]) {
//         return this.questionnaireService.executeUpdate(questionnaire,
//             countryAssignemnt,
//             regionAssignment, subRegionAssignment,
//             tradeChannelAssignemnt,
//             customerAssignemnt, branchAssignemnt,
//             positionAssignemnt,
//             userAssignment);
//     }
//     createCategory(cat: Category) {
//         return this.categoryService.createCategory(cat);
//     }
//     createBrand(cat: Brand) {
//         return this.brandService.createBrand(cat);
//     }
//     createItemAssignment(assignedItems: ItemAssignment[]) {
//         return this.categoryService.createItemAssignment(assignedItems);
//     }
//     createVariant(vari: Varaint) {
//         return this.categoryService.createVariant(vari);
//     }
//     createCompetitorVariant(vari: CompetitorVariant) {
//         return this.brandService.createCompetitorVariant(vari);
//     }
//     createConfiguration(config?: TradeChannelConfig) {
//         return this.tradeChannelService.createConfiguration(config);
//     }
//     getBranchManagers() {
//         return this.personnelService.getBranchManagers();
//     }
//     updateAvatar(personnel: Personnel, file: any) {
//         return this.personnelService.executeUpdateAvatar(personnel, file);
//     }
//     addAvatar(personnel: Personnel, file: any) {
//         return this.personnelService.executeAddAvatar(personnel, file);
//     }
//     generateObjectiveReport(contextType: number, country: string[], region: string[], subRegion: string[], startDate: string, endDate: string, type: string[], tradeChannel: string[], customer: string[], branch: string[], status: string[], priority: string[]) {
//         return this.objectiveService.generateReport(contextType, country, region, subRegion, startDate, endDate, type, tradeChannel, customer, branch, status, priority);
//     }
//     generateAlalaliPromotionEvaluationReport(country: string[], region: string[], subRegion: string[], startDate: string, endDate: string, tradeChannel: string[], customer: string[], branch: string[], status: string[], product: string[], display: string[], position: string[], admin: string[]) {
//         return this.promotionService.generateReport(country, region, subRegion, startDate, endDate, tradeChannel, customer, branch, status, product, display, position, admin);
//     }
//     generateCompetitorEvaluationReport(country: string[],
//         region: string[], subRegion: string[], startDate: string, endDate: string, tradeChannel: string[], customer: string[], branch: string[], product: string[],
//         display: string[],
//         origin: string[],
//         brand: string[],
//         promotionType: string[], position: string[], admin: string[]
//     ) {
//         return this.competitorPromotionService.generateReport(country, region, subRegion, startDate, endDate, tradeChannel, customer, branch, product, display, origin, brand, promotionType, position, admin);
//     }
//     generateNewProductReport(country: string[],
//         region: string[], subRegion: string[], startDate: string, endDate: string, tradeChannel: string[], customer: string[], branch: string[], product: string[],
//         display: string[],
//         brand: string[],
//         variant: string[],
//     ) {
//         return this.newProductService.generateReport(country, region, subRegion, startDate, endDate, tradeChannel, customer, branch, product, display, brand, variant);
//     }
//     generateBrandingReport(country: string[],
//         region: string[], subRegion: string[], startDate: string, endDate: string, tradeChannel: string[], customer: string[], branch: string[], product: string[], brand: string[],
//         display: string[],
//         displaySeason: string[], position: string[],
//         admin: string[],
//         isMonthly: boolean
//     ) {
//         return this.monthlyBrandingService.generateReport(country, region, subRegion, startDate, endDate, tradeChannel, customer, branch, product, brand, display, displaySeason, position, admin, isMonthly);
//     }
//     generateMarketingReport(country: string[],
//         region: string[], subRegion: string[], startDate: string, endDate: string, tradeChannel: string[], customer: string[], branch: string[], product: string[],
//         display: string[],
//         admin: string[], position: string[]
//     ) {
//         return this.campaignService.generateReport(country, region, subRegion, startDate, endDate, tradeChannel, customer, branch, product, display, admin, position);
//     }
//     generateShelfShareReport(country: string[],
//         region: string[], subRegion: string[], startDate: string, endDate: string, tradeChannel: string[], customer: string[], branch: string[], product: string[],
//         brand: string[],
//         admin: string[], position: string[]
//     ) {
//         return this.shelfShareService.generateReport(country, region, subRegion, startDate, endDate, tradeChannel, customer, branch, product, brand, admin, position);
//     }
//     generatePriceSurveyReport(country: string[],
//         region: string[], subRegion: string[], startDate: string, endDate: string, tradeChannel: string[],
//         customer: string[], branch: string[], product: string[],
//         brand: string[],
//         variant: string[],
//         metricType: string[],
//         admin: string[], position: string[]
//     ) {
//         return this.priceSurveyService.generateReport(country, region, subRegion, startDate, endDate, tradeChannel, customer, branch, product, brand, variant, metricType, admin, position);
//     }
//     generateAchievmentFormReport(country: string[],
//         region: string[], subRegion: string[], startDate: string, endDate: string, tradeChannel: string[],
//         customer: string[], branch: string[], admin: string[], position: string[]
//     ) {
//         return this.achievmentFormService.generateReport(country, region, subRegion, startDate, endDate, tradeChannel, customer, branch, admin, position);
//     }
//     generateQuestionaireReport(country: string[],
//         region: string[], subRegion: string[], startDate: string, endDate: string, tradeChannel: string[],
//         customer: string[], branch: string[],status: string[], admin: string[], position: string[], employee: string[], surveyQuestion: boolean
//     ) {
//         return this.questionnaireService.generateReport(country, region, subRegion, startDate, endDate, tradeChannel, customer, branch,status, admin, position, employee, surveyQuestion);
//     }
//     generateMonthlyEvaluationReport(country: string[], region: string[], subRegion: string[], startDate: string, endDate: string, branch: string[], admin: string[], userRole: string[], isMonthly: boolean) {
//         return this.personnelService.generateReport(country, region, subRegion, startDate, endDate, branch, admin, userRole, isMonthly);
//     }
//     generateContractReport(country: string[], region: string[], subRegion: string[], startDate: string, endDate: string, tradeChannel: string[], customer: string[], branch: string[], category: string[], type: string[], status: string[], contractType: number) {
//         return this.contractService.generateReport(country, region, subRegion, startDate, endDate, tradeChannel, customer, branch, category, type, status, contractType);
//     }
// }