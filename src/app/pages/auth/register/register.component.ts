import {Component, OnInit} from '@angular/core';

import {Location, PlatformLocation} from '@angular/common';
import {FormBuilder} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ConfigService} from '../../shared/services/config.service';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'ngx-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
    showPass = 0;
    isCodeUnique = false;
    errorMessage = '';
    successMessage = '';
    user = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        repeatPassword: '',
        name: '',
        code: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        state: '',
        defaultLang: '',
    };
    countries: Array<any> = [];
    provinces: Array<any> = [];
    languages: Array<any> = [];

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private toastr: ToastrService,
        private translate: TranslateService,
        private configService: ConfigService,
        private location: Location,
        private platformLocation: PlatformLocation,
    ) {
        this.configService.getListOfCountriesByLanguage(navigator.language)
            .subscribe(data => {
                this.countries = data;
            }, () => {
            });
        this.languages = [...this.configService.languages];
    }

    countryIsSelected(code) {
        this.provinces = [];
        // this.stateProvince.disable();
        this.configService.getListOfZonesProvincesByCountry(code)
            .subscribe(provinces => {
                this.provinces = [...provinces];
            }, () => {
                this.toastr.success(this.translate.instant('STORE_FORM.ERROR_STATE_PROVINCE'));
            });
    }

    ngOnInit() {


    }

    checkCode(event) {
        const code = event.target.value;
        this.authService.checkIfStoreExist(code)
            .subscribe(res => {
                this.isCodeUnique = res.exists;
            });
    }

    passwordType() {
        return this.showPass;
    }

    showPassword() {
        if (this.showPass === 0) {
            this.showPass = 1;
        } else {
            this.showPass = 0;
        }
    }

    onRegister() {
        const param = {
            address: this.user.address,
            city: this.user.city,
            code: this.user.code,
            country: this.user.country,
            email: this.user.email,
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            name: this.user.name,
            password: this.user.password,
            postalCode: this.user.postalCode,
            repeatPassword: this.user.repeatPassword,
            stateProvince: this.user.state,
            defaultLang: this.user.defaultLang,
            url: (this.platformLocation as any).location.origin + this.location.prepareExternalUrl('/'),
        };
        this.authService.register(param)
            .subscribe(() => {
                this.errorMessage = '';
                this.successMessage = 'Your account is created successfully and email has been sent to '
                    + this.user.email
                    + ' with details on completing the new store signup';
                this.user = {
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    repeatPassword: '',
                    name: '',
                    code: '',
                    address: '',
                    city: '',
                    postalCode: '',
                    country: '',
                    state: '',
                    defaultLang: '',
                };
            }, err => {
                if (err.status === 0) {
                    this.errorMessage = this.translate.instant('COMMON.INTERNAL_SERVER_ERROR');
                } else {
                    this.errorMessage = err.error.message;
                }

            });
    }

    onClickLogin() {
        this.router.navigate(['auth']);
    }
}
