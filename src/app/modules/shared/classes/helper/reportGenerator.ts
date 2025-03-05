import { FormGroup } from '@angular/forms';
import { FacadeService } from './facade.service';
import { Utility } from './utility';
import { Objective } from '../../models/objective.model';
import { Observable, of } from 'rxjs';
import { ContartType, ContextType } from './enum';

export class ReportGenerator {
    constructor(
        private form: FormGroup,
        private _facadeService: FacadeService,
        private reportType: number
    ) { }

    generateReport(): Observable<any> {


        switch (this.reportType) {
            case 1:
                // return this.generateObjectiveReport();
                break;
            case 2:
                return this.generateObjectiveReport(ContextType.OBJECTIVE);
                break;
            case 3:
                // return this.generateObjectiveReport();
                break;
            case 4:
                return this.generateObjectiveReport(ContextType.TASK);
                break;
            case 5:
                return this.generateAlalaliPromotionEvaluationReport();
                break;
            case 6:
                return this.generateCompetitorEvaluationReport();
                break;
            case 7:
                return this.generateNewProductReport();
                break;
            case 8:
                return this.generateBrandingReport(true);
                break;
            case 9:
                return this.generateBrandingReport(false);
                break;
            case 10:
                return this.generateMarketingReport();
                break;
            case 11:
                return this.generateShelfShareReport();
                break;
            case 12:
                return this.generatePriceSurveyReport();
                break;
            case 13:
                return this.generateAchievmentFormReport();
                break;
            case 14:
                return this.generateQuestionaireReport(false);
                break;
            case 15:
                return this.generateQuestionaireReport(true);
                break;
            case 16:
                return this.generateMonthlyEvaluationReport();
                break;
            case 17:
                return this.generateYearlyEvaluationReport();
                break;
            case 18:
                return this.generateContractReport(ContartType.YEARLY);
                break;
            case 19:
                return this.generateContractReport(ContartType.SECONDARY);
                break;
            // Add more cases as needed
            default:
                console.warn('Unknown report type:', this.reportType);
                return of(null);
        }
    }

    private generateObjectiveReport(contextType: number): Observable<any> {
        const reportData = {
            country: this.form.get('country')?.value,
            region: this.form.get('region')?.value,
            subRegion: this.form.get('subRegion')?.value,
            startDate: this.form.get('startDate')?.value,
            endDate: this.form.get('endDate')?.value,
            type: this.form.get('type')?.value,
            tradeChannel: this.form.get('tradeChannel')?.value,
            customer: this.form.get('customer')?.value,
            branch: this.form.get('branch')?.value,
            status: this.form.get('status')?.value,
            priority: this.form.get('priority')?.value,
            // add other fields as needed
        };
        return this._facadeService.generateObjectiveReport(
            contextType,
            Utility.formatValue(reportData.country),
            Utility.formatValue(reportData.region),
            Utility.formatValue(reportData.subRegion),
            reportData.startDate,
            reportData.endDate,
            Utility.formatValue(reportData.type),
            Utility.formatValue(reportData.tradeChannel),
            Utility.formatValue(reportData.customer),
            Utility.formatValue(reportData.branch),
            Utility.formatValue(reportData.status),
            Utility.formatValue(reportData.priority)
            // add any other fields as needed
        );
    }
    private generateAlalaliPromotionEvaluationReport(): Observable<any> {
        const reportData = {
            country: this.form.get('country')?.value,
            region: this.form.get('region')?.value,
            subRegion: this.form.get('subRegion')?.value,
            startDate: this.form.get('startDate')?.value,
            endDate: this.form.get('endDate')?.value,
            tradeChannel: this.form.get('tradeChannel')?.value,
            customer: this.form.get('customer')?.value,
            branch: this.form.get('branch')?.value,
            status: this.form.get('status')?.value,
            product: this.form.get('product')?.value,
            display: this.form.get('displayType')?.value,
            position: this.form.get('userPosition')?.value,
            admin: this.form.get('admin')?.value,
            // add other fields as needed
        };
        return this._facadeService.generateAlalaliPromotionEvaluationReport(
            Utility.formatValue(reportData.country),
            Utility.formatValue(reportData.region),
            Utility.formatValue(reportData.subRegion),
            reportData.startDate,
            reportData.endDate,
            Utility.formatValue(reportData.tradeChannel),
            Utility.formatValue(reportData.customer),
            Utility.formatValue(reportData.branch),
            Utility.formatValue(reportData.status),
            Utility.formatValue(reportData.product),
            Utility.formatValue(reportData.display),
            Utility.formatValue(reportData.position),
            Utility.formatValue(reportData.admin),
            // add any other fields as needed
        );
    }
    private generateCompetitorEvaluationReport(): Observable<any> {
        const reportData = {
            country: this.form.get('country')?.value,
            region: this.form.get('region')?.value,
            subRegion: this.form.get('subRegion')?.value,
            startDate: this.form.get('startDate')?.value,
            endDate: this.form.get('endDate')?.value,
            tradeChannel: this.form.get('tradeChannel')?.value,
            customer: this.form.get('customer')?.value,
            branch: this.form.get('branch')?.value,
            origin: this.form.get('origin')?.value,
            product: this.form.get('product')?.value,
            brand: this.form.get('brand')?.value,
            promotionType: this.form.get('promotionType')?.value,
            display: this.form.get('displayType')?.value,
            position: this.form.get('userPosition')?.value,
            admin: this.form.get('admin')?.value,
            // add other fields as needed
        };
        return this._facadeService.generateCompetitorEvaluationReport(
            Utility.formatValue(reportData.country),
            Utility.formatValue(reportData.region),
            Utility.formatValue(reportData.subRegion),
            reportData.startDate,
            reportData.endDate,
            Utility.formatValue(reportData.tradeChannel),
            Utility.formatValue(reportData.customer),
            Utility.formatValue(reportData.branch),
            Utility.formatValue(reportData.product),
            Utility.formatValue(reportData.display),
            Utility.formatValue(reportData.origin),
            Utility.formatValue(reportData.brand),
            Utility.formatValue(reportData.promotionType),
            Utility.formatValue(reportData.position),
            Utility.formatValue(reportData.admin),
            // add any other fields as needed //
        );
    }
    private generateNewProductReport(): Observable<any> {

        const reportData = {
            country: this.form.get('country')?.value,
            region: this.form.get('region')?.value,
            subRegion: this.form.get('subRegion')?.value,
            startDate: this.form.get('startDate')?.value,
            endDate: this.form.get('endDate')?.value,
            tradeChannel: this.form.get('tradeChannel')?.value,
            customer: this.form.get('customer')?.value,
            branch: this.form.get('branch')?.value,
            variant: this.form.get('variant')?.value,
            product: this.form.get('product')?.value,
            brand: this.form.get('brand')?.value,
            display: this.form.get('displayType')?.value,
            // add other fields as needed
        };

        return this._facadeService.generateNewProductReport(
            Utility.formatValue(reportData.country),
            Utility.formatValue(reportData.region),
            Utility.formatValue(reportData.subRegion),
            reportData.startDate,
            reportData.endDate,
            Utility.formatValue(reportData.tradeChannel),
            Utility.formatValue(reportData.customer),
            Utility.formatValue(reportData.branch),
            Utility.formatValue(reportData.product),
            Utility.formatValue(reportData.display),
            Utility.formatValue(reportData.brand),
            Utility.formatValue(reportData.variant),
            // add any other fields as needed
        );
    }
    private generateBrandingReport(isMonthly: boolean): Observable<any> {

        const reportData = {
            country: this.form.get('country')?.value,
            region: this.form.get('region')?.value,
            subRegion: this.form.get('subRegion')?.value,
            startDate: this.form.get('startDate')?.value,
            endDate: this.form.get('endDate')?.value,
            tradeChannel: this.form.get('tradeChannel')?.value,
            customer: this.form.get('customer')?.value,
            branch: this.form.get('branch')?.value,
            displaySeason: this.form.get('displaySeason')?.value,
            product: this.form.get('product')?.value,
            brand: this.form.get('brand')?.value,
            display: this.form.get('displayType')?.value,
            position: this.form.get('userPosition')?.value,
            admin: this.form.get('admin')?.value,
            // add other fields as needed
        };

        return this._facadeService.generateBrandingReport(
            Utility.formatValue(reportData.country),
            Utility.formatValue(reportData.region),
            Utility.formatValue(reportData.subRegion),
            reportData.startDate,
            reportData.endDate,
            Utility.formatValue(reportData.tradeChannel),
            Utility.formatValue(reportData.customer),
            Utility.formatValue(reportData.branch),
            Utility.formatValue(reportData.product),
            Utility.formatValue(reportData.brand),
            Utility.formatValue(reportData.display),
            Utility.formatValue(reportData.displaySeason),
            Utility.formatValue(reportData.position),
            Utility.formatValue(reportData.admin),
            isMonthly
            // add any other fields as needed
        );
    }
    private generateMarketingReport(): Observable<any> {

        const reportData = {
            country: this.form.get('country')?.value,
            region: this.form.get('region')?.value,
            subRegion: this.form.get('subRegion')?.value,
            startDate: this.form.get('startDate')?.value,
            endDate: this.form.get('endDate')?.value,
            tradeChannel: this.form.get('tradeChannel')?.value,
            customer: this.form.get('customer')?.value,
            branch: this.form.get('branch')?.value,
            product: this.form.get('product')?.value,
            display: this.form.get('displayType')?.value,
            admin: this.form.get('admin')?.value,
            position: this.form.get('userPosition')?.value,
            // add other fields as needed
        };

        return this._facadeService.generateMarketingReport(
            Utility.formatValue(reportData.country),
            Utility.formatValue(reportData.region),
            Utility.formatValue(reportData.subRegion),
            reportData.startDate,
            reportData.endDate,
            Utility.formatValue(reportData.tradeChannel),
            Utility.formatValue(reportData.customer),
            Utility.formatValue(reportData.branch),
            Utility.formatValue(reportData.product),
            Utility.formatValue(reportData.display),
            Utility.formatValue(reportData.admin),
            Utility.formatValue(reportData.position),
            // add any other fields as needed
        );
    }
    private generateShelfShareReport(): Observable<any> {

        const reportData = {
            country: this.form.get('country')?.value,
            region: this.form.get('region')?.value,
            subRegion: this.form.get('subRegion')?.value,
            startDate: this.form.get('startDate')?.value,
            endDate: this.form.get('endDate')?.value,
            tradeChannel: this.form.get('tradeChannel')?.value,
            customer: this.form.get('customer')?.value,
            branch: this.form.get('branch')?.value,
            product: this.form.get('product')?.value,
            brand: this.form.get('brand')?.value,
            admin: this.form.get('admin')?.value,
            position: this.form.get('userPosition')?.value,
            // add other fields as needed
        };

        return this._facadeService.generateShelfShareReport(
            Utility.formatValue(reportData.country),
            Utility.formatValue(reportData.region),
            Utility.formatValue(reportData.subRegion),
            reportData.startDate,
            reportData.endDate,
            Utility.formatValue(reportData.tradeChannel),
            Utility.formatValue(reportData.customer),
            Utility.formatValue(reportData.branch),
            Utility.formatValue(reportData.product),
            Utility.formatValue(reportData.brand),
            Utility.formatValue(reportData.admin),
            Utility.formatValue(reportData.position),
            // add any other fields as needed
        );
    }
    private generatePriceSurveyReport(): Observable<any> {

        const reportData = {
            country: this.form.get('country')?.value,
            region: this.form.get('region')?.value,
            subRegion: this.form.get('subRegion')?.value,
            startDate: this.form.get('startDate')?.value,
            endDate: this.form.get('endDate')?.value,
            tradeChannel: this.form.get('tradeChannel')?.value,
            customer: this.form.get('customer')?.value,
            branch: this.form.get('branch')?.value,
            product: this.form.get('product')?.value,
            brand: this.form.get('brand')?.value,
            variant: this.form.get('variant')?.value,
            metricType: this.form.get('metricType')?.value,
            admin: this.form.get('admin')?.value,
            position: this.form.get('userPosition')?.value,
            // add other fields as needed
        };

        return this._facadeService.generatePriceSurveyReport(
            Utility.formatValue(reportData.country),
            Utility.formatValue(reportData.region),
            Utility.formatValue(reportData.subRegion),
            reportData.startDate,
            reportData.endDate,
            Utility.formatValue(reportData.tradeChannel),
            Utility.formatValue(reportData.customer),
            Utility.formatValue(reportData.branch),
            Utility.formatValue(reportData.product),
            Utility.formatValue(reportData.brand),
            Utility.formatValue(reportData.variant),
            Utility.formatValue(reportData.metricType),
            Utility.formatValue(reportData.admin),
            Utility.formatValue(reportData.position)
            // add any other fields as needed
        );
    }
    private generateAchievmentFormReport(): Observable<any> {

        const reportData = {
            country: this.form.get('country')?.value,
            region: this.form.get('region')?.value,
            subRegion: this.form.get('subRegion')?.value,
            startDate: this.form.get('startDate')?.value,
            endDate: this.form.get('endDate')?.value,
            tradeChannel: this.form.get('tradeChannel')?.value,
            customer: this.form.get('customer')?.value,
            branch: this.form.get('branch')?.value,
            admin: this.form.get('admin')?.value,
            position: this.form.get('userPosition')?.value,
            // add other fields as needed
        };

        return this._facadeService.generateAchievmentFormReport(
            Utility.formatValue(reportData.country),
            Utility.formatValue(reportData.region),
            Utility.formatValue(reportData.subRegion),
            reportData.startDate,
            reportData.endDate,
            Utility.formatValue(reportData.tradeChannel),
            Utility.formatValue(reportData.customer),
            Utility.formatValue(reportData.branch),
            Utility.formatValue(reportData.admin),
            Utility.formatValue(reportData.position),
            // add any other fields as needed
        );
    }
    private generateQuestionaireReport(surveyQuestion: boolean): Observable<any> {

        const reportData = {
            country: this.form.get('country')?.value,
            region: this.form.get('region')?.value,
            subRegion: this.form.get('subRegion')?.value,
            startDate: this.form.get('startDate')?.value,
            endDate: this.form.get('endDate')?.value,
            tradeChannel: this.form.get('tradeChannel')?.value,
            customer: this.form.get('customer')?.value,
            branch: this.form.get('branch')?.value,
            status: this.form.get('status')?.value,
            admin: this.form.get('admin')?.value,
            position: this.form.get('userPosition')?.value,
            employee: this.form.get('assignee')?.value,
            // add other fields as needed
        };

        return this._facadeService.generateQuestionaireReport(
            Utility.formatValue(reportData.country),
            Utility.formatValue(reportData.region),
            Utility.formatValue(reportData.subRegion),
            reportData.startDate,
            reportData.endDate,
            Utility.formatValue(reportData.tradeChannel),
            Utility.formatValue(reportData.customer),
            Utility.formatValue(reportData.branch),
            Utility.formatValue(reportData.status),
            Utility.formatValue(reportData.admin),
            Utility.formatValue(reportData.position),
            Utility.formatValue(reportData.employee),
            surveyQuestion
            // add any other fields as needed
        );
    }
    private generateMonthlyEvaluationReport(): Observable<any> {

        const reportData = {
            country: this.form.get('country')?.value,
            region: this.form.get('region')?.value,
            subRegion: this.form.get('subRegion')?.value,
            startDate: this.form.get('startDate')?.value,
            endDate: this.form.get('endDate')?.value,
            userRole: this.form.get('userPosition')?.value,
            customer: this.form.get('customer')?.value,
            branch: this.form.get('branch')?.value,
            admin: this.form.get('admin')?.value,
            // add other fields as needed
        };

        return this._facadeService.generateMonthlyEvaluationReport(
            Utility.formatValue(reportData.country),
            Utility.formatValue(reportData.region),
            Utility.formatValue(reportData.subRegion),
            reportData.startDate,
            reportData.endDate,
            Utility.formatValue(reportData.branch),
            Utility.formatValue(reportData.admin),
            Utility.formatValue(reportData.userRole),
            true,
            // add any other fields as needed
        );
    }
    private generateYearlyEvaluationReport(): Observable<any> {

        var { startDate, endDate } = Utility.setYearRange(this.form.get('lifeSpam')?.value);
        const reportData = {
            country: this.form.get('country')?.value,
            region: this.form.get('region')?.value,
            subRegion: this.form.get('subRegion')?.value,
            startDate: this.form.get('startDate')?.value,
            endDate: this.form.get('endDate')?.value,
            userRole: this.form.get('userPosition')?.value,
            customer: this.form.get('customer')?.value,
            branch: this.form.get('branch')?.value,
            admin: this.form.get('admin')?.value,

            // add other fields as needed
        };

        return this._facadeService.generateMonthlyEvaluationReport(
            Utility.formatValue(reportData.country),
            Utility.formatValue(reportData.region),
            Utility.formatValue(reportData.subRegion),
            startDate,
            endDate,
            Utility.formatValue(reportData.branch),
            Utility.formatValue(reportData.admin),
            Utility.formatValue(reportData.userRole),
            false,
            // add any other fields as needed
        );
    }
    private generateContractReport(contractType: number): Observable<any> {

        const reportData = {
            country: this.form.get('country')?.value,
            region: this.form.get('region')?.value,
            subRegion: this.form.get('subRegion')?.value,
            startDate: this.form.get('startDate')?.value,
            endDate: this.form.get('endDate')?.value,
            customer: this.form.get('customer')?.value,
            tradeChannel: this.form.get('tradeChannel')?.value,
            branch: this.form.get('branch')?.value,
            type: this.form.get('type')?.value,
            status: this.form.get('status')?.value,
            category: this.form.get('category')?.value,
            // add other fields as needed
        };

        return this._facadeService.generateContractReport(
            Utility.formatValue(reportData.country),
            Utility.formatValue(reportData.region),
            Utility.formatValue(reportData.subRegion),
            reportData.startDate,
            reportData.endDate,
            Utility.formatValue(reportData.tradeChannel),
            Utility.formatValue(reportData.customer),
            Utility.formatValue(reportData.branch),
            Utility.formatValue(reportData.category),
            Utility.formatValue(reportData.type),
            Utility.formatValue(reportData.status),
            contractType
            // add any other fields as needed
        );
    }
}
