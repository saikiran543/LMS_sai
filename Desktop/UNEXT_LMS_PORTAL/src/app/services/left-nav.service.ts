/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpMethod } from '../enums/httpMethod';
import { Service } from '../enums/service';
import { StorageKey } from '../enums/storageKey';
import { AuthorizationService } from './authorization.service';
import { HttpClientService } from './http-client.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class LeftNavService {
  private sidebarItems = [
    {
      id: 'dashboard',
      icon: 'assets/images/icons/icon-dashboard.svg',
      displayName: 'leftMenu.sidebarItems.dashboard',
      position: 'top',
      authorizationReqd: false,
      leftMenu: false,
      title: '',
      route: 'dashboard',
      active: false,
      show: true
    },
    {
      id: 'communities',
      icon: 'assets/images/icons/icon-learningcentre.svg',
      displayName: 'leftMenu.sidebarItems.communities',
      position: 'top',
      authorizationReqd: true,
      leftMenu: true,
      title: '',
      route: 'communities',
      active: false,
      show: false
    },
    {
      id: 'learning-center',
      icon: 'assets/images/icons/icon-learningcentre.svg',
      displayName: 'leftMenu.sidebarItems.learningCenter',
      position: 'top',
      authorizationReqd: false,
      leftMenu: false,
      title: '',
      route: 'learning-center',
      show: true
    },
    {
      id: 'gamification',
      displayName: 'leftMenu.sidebarItems.gamification',
      position: 'top',
      authorizationReqd: false,
      route: 'program-gamification',
      show: true,
      active: true,
      view: ['admin', 'student']
    },
    {
      id: 'leaderboard',
      authorizationReqd: false,
      route: 'leaderboard',
      show: false,
      view: ['admin', 'student']
    },
    {
      id: 'configAndSettings',
      icon: 'assets/images/icons/icon-settings.svg',
      displayName: 'leftMenu.sidebarItems.configSettings',
      position: 'bottom',
      authorizationReqd: true,
      leftMenu: true,
      title: '',
      route: 'config-and-settings',
      active: false,
      show: true
    },
    {
      id: 'helpdesk',
      icon: 'assets/images/icons/icon-helpdesk.svg',
      displayName: 'helpdesk',
      position: 'bottom',
      authorizationReqd: false,
      leftMenu: true,
      title: '',
      route: 'helpdesk',
      active: true,
      show: true,
      disable: true
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private slideMenuItems: any = {
    configAndSettings: [
      {
        id: 'loginpage',
        icon: 'assets/images/icons/icon-loginpage.svg',
        displayName: 'leftMenu.slideMenuItems.configAndSettings.loginPage',
        position: 'top',
        authorizationReqd: false,
        route: 'login-settings',
        active: false,
        show: true,
        view: ['admin', 'student']
      },
      {
        id: 'brandingpage',
        icon: 'assets/images/icons/icon-brandingpage.svg',
        displayName: 'leftMenu.slideMenuItems.configAndSettings.brandingPage',
        position: 'top',
        authorizationReqd: false,
        route: 'branding-settings',
        active: false,
        show: true,
        view: ['admin', 'student']
      },
      {
        id: 'emailtemplatepage',
        icon: 'assets/images/icons/icon-emailtemplate.svg',
        displayName: 'leftMenu.slideMenuItems.configAndSettings.emailTemplatePage',
        position: 'top',
        authorizationReqd: false,
        route: 'config-and-settings/email-template-page',
        active: false,
        show: true,
        disable: true,
        view: ['admin', 'student']
      },
    ],
    communities: [
      {
        id: 'loginSettings',
        displayName: 'leftMenu.slideMenuItems.communities.loginSettings',
        authorizationReqd: false,
        active: false,
        show: true,
        view: ['admin', 'student']
      },
      {
        id: 'brandingSettings',
        displayName: 'leftMenu.slideMenuItems.communities.brandingSettings',
        authorizationReqd: false,
        active: false,
        show: true,
        view: ['admin', 'student']
      },
    ],
    'learning-center': [
      {
        id: 'content-area',
        icon: 'assets/images/icons/learning-center/icon-contentarea.svg',
        displayName: 'leftMenu.slideMenuItems.learningCenter.contentArea',
        position: 'top',
        authorizationReqd: false,
        route: 'content-area',
        show: true,
        active: true,
        view: ['admin', 'student']
      },
      {
        id: 'recorded-sessions',
        icon: 'assets/images/icons/learning-center/icon-recordedsessions.svg',
        displayName: 'leftMenu.slideMenuItems.learningCenter.recordedSessions',
        position: 'top',
        authorizationReqd: false,
        route: 'learning-center/recorded-sessions',
        show: true,
        disable: true,
        view: ['admin', 'student']
      },
      {
        id: 'quiz',
        icon: 'assets/images/icons/learning-center/icon-quiz.svg',
        displayName: 'leftMenu.slideMenuItems.learningCenter.quiz',
        position: 'top',
        authorizationReqd: false,
        route: 'learning-center/quiz',
        show: true,
        disable: true,
        view: ['admin', 'student']
      },
      {
        id: 'assignments',
        icon: 'assets/images/icons/learning-center/icon-assignments.svg',
        displayName: 'leftMenu.slideMenuItems.learningCenter.assignments',
        position: 'top',
        authorizationReqd: false,
        route: 'learning-center/assignments',
        show: true,
        disable: true,
        view: ['admin', 'student']
      },
      {
        id: 'survey',
        icon: 'assets/images/icons/learning-center/icon-survey.svg',
        displayName: 'leftMenu.slideMenuItems.learningCenter.survey',
        position: 'top',
        authorizationReqd: false,
        route: 'learning-center/survey',
        show: true,
        disable: true,
        view: ['admin', 'student']
      },
      {
        id: 'discussion-forums',
        icon: 'assets/images/icons/learning-center/icon-discussionforums.svg',
        displayName: 'leftMenu.slideMenuItems.learningCenter.discussionForums',
        position: 'top',
        authorizationReqd: false,
        route: 'discussion-forums',
        show: true,
        disable: false,
        view: ['admin', 'student']
      },
      {
        id: 'programming-lab',
        icon: 'assets/images/icons/learning-center/icon-programminglab.svg',
        displayName: 'leftMenu.slideMenuItems.learningCenter.programmingLab',
        position: 'top',
        authorizationReqd: false,
        route: 'learning-center/programming-lab',
        show: true,
        disable: true,
        view: ['admin', 'student']
      },
      {
        id: 'whats-new',
        icon: 'assets/images/icons/learning-center/icon-whatsnew.svg',
        displayName: 'leftMenu.slideMenuItems.learningCenter.whatsNew',
        position: 'top',
        authorizationReqd: false,
        route: 'learning-center/whats-new',
        show: true,
        disable: true,
        view: ['admin', 'student']
      },
      {
        id: 'todays-task',
        icon: 'assets/images/icons/learning-center/icon-todaystask.svg',
        displayName: 'leftMenu.slideMenuItems.learningCenter.todaysTask',
        position: 'top',
        authorizationReqd: false,
        route: 'todays-task',
        show: true,
        disable: false,
        view: ['admin', 'student']
      },
      {
        id: 'calendar',
        icon: 'assets/images/icons/learning-center/icon-calendar.svg',
        displayName: 'leftMenu.slideMenuItems.learningCenter.calendar',
        position: 'top',
        authorizationReqd: false,
        route: 'calendar',
        show: true,
        disable: false,
        view: ['admin', 'student']
      },
      {
        id: 'course-gamification',
        displayName: 'leftMenu.slideMenuItems.learningCenter.gamification',
        position: 'top',
        authorizationReqd: false,
        route: 'course-gamification',
        show: true,
        disable: false,
        view: ['admin', 'student']
      },
      {
        id: 'announcements',
        icon: 'assets/images/icons/learning-center/icon-announcements.svg',
        displayName: 'leftMenu.slideMenuItems.learningCenter.announcements',
        position: 'top',
        authorizationReqd: false,
        route: 'learning-center/announcements',
        show: true,
        disable: true,
        view: ['admin', 'student']
      },
      {
        id: 'blogs',
        icon: 'assets/images/icons/learning-center/icon-blogs.svg',
        displayName: 'leftMenu.slideMenuItems.learningCenter.blogs',
        position: 'top',
        authorizationReqd: false,
        route: 'blogs',
        show: true,
        disable: true,
        view: ['admin', 'student']
      },
      {
        id: 'rubrics',
        icon: 'assets/images/icons/learning-center/icon-rubrics.svg',
        displayName: 'leftMenu.slideMenuItems.learningCenter.rubrics',
        position: 'top',
        authorizationReqd: false,
        route: 'rubrics/course',
        show: true,
        disable: false,
        view: ['admin']
      },
      {
        id: 'learning-outcomes',
        icon: 'assets/images/icons/learning-center/icon-learningOutcome.svg',
        displayName: 'leftMenu.slideMenuItems.learningCenter.learningOutcomes',
        position: 'top',
        authorizationReqd: false,
        route: 'learning-outcome',
        show: true,
        disable: false,
        view: ['admin']
      },
      {
        id: 'all-notes',
        icon: 'assets/images/icons/learning-center/icon-notes.svg',
        displayName: 'leftMenu.slideMenuItems.learningCenter.allNotes',
        position: 'bottom',
        authorizationReqd: false,
        route: 'all-notes',
        show: true,
        view: ['admin', 'student']
      },
      {
        id: 'all-qna',
        icon: 'assets/images/icons/learning-center/icon-qa.svg',
        displayName: 'leftMenu.slideMenuItems.learningCenter.allQ&a',
        position: 'bottom',
        authorizationReqd: false,
        route: 'all-qna',
        show: true,
        disable: false,
        view: ['admin', 'student']
      },
      {
        id: 'downloaded-files',
        icon: 'assets/images/icons/learning-center/icon-downloadedfiles.svg',
        displayName: 'leftMenu.slideMenuItems.learningCenter.downloadedFiles',
        position: 'bottom',
        authorizationReqd: false,
        route: 'downloaded-files',
        show: true,
        disable: true,
        view: ['admin', 'student']
      },
      {
        id: 'bookmark-list',
        icon: 'assets/images/icons/learning-center/icon-bookmarklist.svg',
        displayName: 'leftMenu.slideMenuItems.learningCenter.bookmarkList',
        position: 'bottom',
        authorizationReqd: false,
        route: 'bookmark-list',
        show: true,
        disable: false,
        view: ['admin', 'student']
      }
    ],
  };
  currentUser!: string;
  messageEmitter = new Subject<boolean>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nodeDetailsEmitter = new BehaviorSubject<any>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nodeDeleteFromToc = new BehaviorSubject<any>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nodeLoadFromToc = new BehaviorSubject<any>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nodeActionPreviousNext = new BehaviorSubject<any>(undefined);

  constructor(private authorizationService: AuthorizationService, private httpClientService: HttpClientService, private storageService: StorageService) { }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getSideBarItems(): Promise<any> {
    return await this.getAuthorizedMenu(this.sidebarItems);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getLeftMenuItems(selectedItem: string): Promise<any> {
    const slideMenuItems = this.filterLeftMenuItems(this.slideMenuItems[selectedItem]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const slideMenu: any = slideMenuItems || [];
    return await this.getAuthorizedMenu(slideMenu);
  }
  filterLeftMenuItems(sideMenuItems: []) {
    const currentUser = this.storageService.get(StorageKey.USER_CURRENT_VIEW);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sideMenus: any = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sideMenuItems.forEach((item: any) => {
      if (item.view.includes(currentUser)) {
        sideMenus.push(item);
      }
    });
    return sideMenus;
  }
  getTitle(selectedItem: string): string {
    return this.sidebarItems
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((item: any) => item.id === selectedItem)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => item.displayName)[0];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async getAuthorizedMenu(items: any): Promise<Array<any>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authRequiredMenu = items.filter((item: any) => item.authorizationReqd && item.show).map((item: any) => item.id);
    if (authRequiredMenu.length === 0) {
      return items;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authRequiredMenu.forEach((element: any) => {
      const actionName = 'VIEW_' + element.toUpperCase();
      data.push({ actionName: actionName, resource: ['NA'] });
    });
    const response = await this.authorizationService.getAuthorizedActions(data);
    const authorizedMenu = response.body;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredMenu: Array<any> = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items.forEach((element: any) => {
      const actionName = 'VIEW_' + element.id.toUpperCase();
      if ((authorizedMenu && authorizedMenu[actionName] && authorizedMenu[actionName]['NA']) || !element.authorizationReqd) {
        filteredMenu.push(element);
      }
    });
    return filteredMenu;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getUser(userId: any) {
    return await this.httpClientService.getResponse(Service.USER_SERVICE, `authentication/getUser/${userId}`, HttpMethod.GET, {});

  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setDeleteNodeFromToc(val: any) {
    this.nodeDeleteFromToc.next(val);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getDeleteNodeFromToc(): Observable<any> {
    return this.nodeDeleteFromToc.asObservable();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setNodeFromToc(val: any) {
    this.nodeLoadFromToc.next(val);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getNodeFromToc(): Observable<any> {
    return this.nodeLoadFromToc.asObservable();
  }

}
