import { Validators } from "@angular/forms";

export class CONSTANTS {
  // Sessions
  static readonly LOGGED_IN_USER = "aXNMb2dnZWRJbg";

  // Date Time Formats
  static readonly LOCALE_EN_US = "en-US";
  static readonly MOMENT_FORMAT_DATE = "YYYY-MM-DD";
  static readonly FORMAT_DATE = "yyyy-MM-dd";
  static readonly INTL_FORMAT_DATE = "MM-dd-yyyy";
  static readonly FORMAT_DATE_TIME = "yyyy-MM-dd'T'HH:mm:ssZZZZZ";
  static readonly DEFAULT_DATE = "2020-01-01";

  static readonly FIELD_REMOVAL_CONFIRMATION_TITLE = "Delete Field?";
  static readonly FIELD_REMOVAL_CONFIRMATION_MESSAGE = "Are you sure you want to delete this field?";

  static readonly CONFIRMED = "confirmed";
  static readonly DELETE = "Delete";

  static heroicons = [
    'academic-cap',
    'archive-box-arrow-down',
    'adjustments-vertical',
    'archive-box',
    'arrow-down-circle',
    'archive-box-x-mark',
    'adjustments-horizontal',
    'arrow-down-left',
    'arrow-down-on-square',
    'arrow-down-on-square-stack',
    'arrow-down',
    'arrow-down-right',
    'arrow-left',
    'arrow-left-circle',
    'arrow-down-tray',
    'arrow-long-right',
    'arrow-long-down',
    'arrow-left-on-rectangle',
    'arrow-path',
    'arrow-long-up',
    'arrow-right-circle',
    'arrow-right-on-rectangle',
    'arrow-right',
    'arrow-small-down',
    'arrow-path-rounded-square',
    'arrow-long-left',
    'arrow-small-left',
    'arrow-trending-down',
    'arrow-small-up',
    'arrow-up-left',
    'arrow-trending-up',
    'arrow-up-circle',
    'arrow-up-on-square-stack',
    'arrow-up-on-square',
    'arrow-up-right',
    'arrow-up-tray',
    'arrow-up',
    'arrow-uturn-right',
    'arrow-uturn-up',
    'arrow-top-right-on-square',
    'arrow-uturn-down',
    'arrows-pointing-out',
    'arrow-uturn-left',
    'arrows-pointing-in',
    'arrows-up-down',
    'at-symbol',
    'backspace',
    'backward',
    'banknotes',
    'arrows-right-left',
    'bars-2',
    'bars-3-bottom-left',
    'bars-3-center-left',
    'bars-3',
    'bars-arrow-down',
    'bars-4',
    'bars-arrow-up',
    'battery-0',
    'bars-3-bottom-right',
    'battery-100',
    'bell-alert',
    'bell-slash',
    'battery-50',
    'arrow-small-right',
    'beaker',
    'bell',
    'bolt',
    'bookmark-slash',
    'book-open',
    'bookmark-square',
    'bolt-slash',
    'bookmark',
    'briefcase',
    'building-library',
    'bell-snooze',
    'building-office-2',
    'building-storefront',
    'building-office',
    'calculator',
    'cake',
    'calendar-days',
    'chart-bar-square',
    'chart-bar',
    'camera',
    'bug-ant',
    'calendar',
    'chat-bubble-bottom-center',
    'chart-pie',
    'chat-bubble-left-right',
    'chat-bubble-left-ellipsis',
    'chat-bubble-bottom-center-text',
    'check-circle',
    'check-badge',
    'chat-bubble-oval-left',
    'chat-bubble-left',
    'check',
    'chat-bubble-oval-left-ellipsis',
    'chevron-double-right',
    'chevron-down',
    'chevron-double-down',
    'chevron-double-up',
    'circle-stack',
    'chevron-up-down',
    'chevron-up',
    'clipboard-document-list',
    'chevron-double-left',
    'chevron-right',
    'chevron-left',
    'cloud-arrow-down',
    'cloud-arrow-up',
    'cloud',
    'code-bracket-square',
    'code-bracket',
    'cog-6-tooth',
    'clipboard-document',
    'clock',
    'clipboard-document-check',
    'cog-8-tooth',
    'cog',
    'command-line',
    'computer-desktop',
    'cube-transparent',
    'cpu-chip',
    'credit-card',
    'cube',
    'currency-dollar',
    'currency-bangladeshi',
    'currency-euro',
    'currency-pound',
    'currency-yen',
    'currency-rupee',
    'cursor-arrow-ripple',
    'device-phone-mobile',
    'device-tablet',
    'document-arrow-down',
    'cursor-arrow-rays',
    'document-check',
    'document-chart-bar',
    'document-duplicate',
    'document-minus',
    'clipboard',
    'document-magnifying-glass',
    'document-plus',
    'document',
    'document-text',
    'ellipsis-horizontal-circle',
    'document-arrow-up',
    'ellipsis-horizontal',
    'ellipsis-vertical',
    'eye-dropper',
    'exclamation-triangle',
    'eye-slash',
    'eye',
    'exclamation-circle',
    'envelope-open',
    'face-smile',
    'film',
    'flag',
    'folder-arrow-down',
    'envelope',
    'fire',
    'folder-minus',
    'folder-open',
    'face-frown',
    'folder-plus',
    'forward',
    'funnel',
    'gift-top',
    'folder',
    'gif',
    'globe-alt',
    'finger-print',
    'globe-asia-australia',
    'globe-europe-africa',
    'hand-raised',
    'gift',
    'home',
    'identification',
    'globe-americas',
    'hashtag',
    'inbox-arrow-down',
    'inbox-stack',
    'information-circle',
    'inbox',
    'key',
    'lifebuoy',
    'hand-thumb-down',
    'language',
    'hand-thumb-up',
    'heart',
    'home-modern',
    'light-bulb',
    'lock-closed',
    'magnifying-glass-plus',
    'magnifying-glass',
    'lock-open',
    'magnifying-glass-circle',
    'link',
    'list-bullet',
    'map',
    'map-pin',
    'megaphone',
    'magnifying-glass-minus',
    'minus-circle',
    'musical-note',
    'paint-brush',
    'newspaper',
    'no-symbol',
    'minus-small',
    'paper-airplane',
    'minus',
    'microphone',
    'moon',
    'paper-clip',
    'pause',
    'phone-arrow-up-right',
    'phone-arrow-down-left',
    'phone-x-mark',
    'phone',
    'pencil',
    'play-pause',
    'photo',
    'pencil-square',
    'play',
    'plus-small',
    'plus',
    'power',
    'play-circle',
    'presentation-chart-line',
    'pause-circle',
    'presentation-chart-bar',
    'printer',
    'question-mark-circle',
    'qr-code',
    'queue-list',
    'receipt-percent',
    'radio',
    'receipt-refund',
    'plus-circle',
    'rectangle-group',
    'puzzle-piece',
    'rocket-launch',
    'rectangle-stack',
    'server',
    'rss',
    'scale',
    'server-stack',
    'share',
    'shield-exclamation',
    'shopping-cart',
    'shopping-bag',
    'signal-slash',
    'signal',
    'scissors',
    'shield-check',
    'speaker-wave',
    'speaker-x-mark',
    'squares-plus',
    'star',
    'stop-circle',
    'sun',
    'sparkles',
    'squares-2x2',
    'square-2-stack',
    'square-3-stack-3d',
    'table-cells',
    'ticket',
    'swatch',
    'tag',
    'tv',
    'user-plus',
    'user-minus',
    'stop',
    'user',
    'truck',
    'users',
    'video-camera-slash',
    'user-circle',
    'video-camera',
    'user-group',
    'trophy',
    'viewfinder-circle',
    'variable',
    'trash',
    'view-columns',
    'wifi',
    'window',
    'wrench-screwdriver',
    'wrench',
    'x-mark',
    'wallet',
    'x-circle',
  ];
  static defaultField = {
    title: ['', Validators.required],
    type: 'text',
    options: [''],
  };

  static firstNameField = {
    title: ['First Name', Validators.required],
    type: 'text',
    options: [''],
  };

  static lastNameField = {
    title: ['Last Name', Validators.required],
    type: 'text',
    options: [''],

  };

  static conctactField = {
    title: ['Contact Number', Validators.required],
    type: 'number',
    options: [''],
  };

  static emailField = {
    title: ['Email', Validators.required],
    type: 'email',
    options: [''],

  };

  static jobField = {
    title: ['Job Title', Validators.required],
    type: 'select',
    options: [''],

  };

  static organizationField = {
    title: ['Organization Name', Validators.required],
    type: 'text',
    options: [''],

  };

  static addressField = {
    title: ['Organization Address', Validators.required],
    type: 'text',
    options: [''],
  };

  // static _welcomeEmailTemplate = {
  //   "title": "Welkomstmail",
  //   "subject": "Welkom bij de IVO-app",
  //   "template": "<p>Beste {{firstName}} {{lastName}},</p><p>Welkom bij IVO! We zijn blij dat je aan boord bent. Hieronder staan je inloggegevens:</p><ul><li>E-mail: {{email}}</li><li>Wachtwoord: {{password}}</li></ul><p>Wij raden je aan je wachtwoord na de eerste keer inloggen te wijzigen om veiligheidsredenen. Laat het ons weten als je hulp nodig hebt.</p><p>Met vriendelijke groet,<br>Het IVO-team</p>"
  // }

  static _welcomeEmailTemplate = {
    "title": "Welkomstmail",
    "subject": "Welkom in de IVO-app",
    "template": "<p>Beste {{firstName}} {{lastName}},</p><p>Welkom bij IVO – Inventarisatie Veilig Onderhoud! Fijn dat u de IVO-app gaat gebruiken. Hieronder vindt u uw inloggegevens.:</p><ul><li>E-mail: {{email}}</li><li>Wachtwoord: {{password}}</li></ul><p>Wij raden u aan om direct na de eerste keer inloggen uw wachtwoord te wijzigen om de veiligheid van uw account te garanderen. Heeft u hulp nodig? Neem gerust contact met ons op.</p><p><a href='{{appURL}}'>{{appURL}}</a></p><p>Met vriendelijke groet,<br>Het IVO-Team</p>"
  }

  static _projectAssignmentEmailTemplate = {
    "title": "Projecttoewijzing",
    "subject": "U bent toegewezen aan een project",
    "template": "<p>Beste {{firstName}} {{lastName}},</p><p>We informeren u dat u bent toegewezen aan het project <strong>{{projectName}}</strong> als <strong>{{role}}</strong>. Bekijk de details in de app en neem gerust contact op bij vragen.</p><p><a href='{{appURL}}'>{{appURL}}</a></p><p>Met vriendelijke groet,<br>Het IVO-Team</p>"
  }

  static _taskSubmissionEmailTemplate = {
    "title": "Taak ingediend",
    "subject": "Melding taakindiening",
    "template": "<p>Beste {{ownerFirstName}} {{ownerLastName}},</p><p>We informeren u dat <strong>{{submitterName}}</strong> de taak <strong>{{taskName}}</strong> heeft ingediend in het project <strong>{{projectName}}</strong>.</p><p>Heeft u vragen? Neem gerust contact met ons op.</p><p><a href='{{appURL}}'>{{appURL}}</a></p><p>Met vriendelijke groet,<br>Het IVO-Team</p>"
     
  }

  // static _welcomeEmailTemplate = {
  //   "title": "Welcome Email",
  //   "subject": "Welcome to the IVO App",
  //   "template": "<p>Dear {{firstName}} {{lastName}},</p><p>Welcome to IVO!</p><p>We're excited to have you on board. Below are your login details:</p><ul><li>Email: {{email}}</li><li>Password: {{password}}</li></ul><p>You can access the IVO app using the following link: <a href='{{appURL}}'>{{appURL}}</a></p><p>Best regards,<br>The IVO Team</p>"
  // }
  
  // static _projectAssignmentEmailTemplate = {
  //   "title": "Project Assignment",
  //   "subject": "You have been assigned to a project",
  //   "template": "<p>Dear {{firstName}} {{lastName}},</p><p>We are pleased to inform you that you have been assigned to the project <strong>{{projectName}}</strong> as <strong>{{role}}</strong>. Please review the project details and let us know if you have any questions.</p><p>You can access the IVO app using the following link: <a href='{{appURL}}'>{{appURL}}</a></p><p>Best regards,<br>The IVO Team</p>"
  // }
  
  // static _taskSubmissionEmailTemplate = {
  //   "title": "Task Submission",
  //   "subject": "Task Submission Notification",
  //   "template": "<p>Dear {{ownerFirstName}} {{ownerLastName}},</p><p>We are pleased to inform you that <strong>{{submitterName}}</strong> has submitted the task <strong>{{taskName}}</strong> in the project <strong>{{projectName}}</strong>.</p><p>You can access the IVO app using the following link: <a href='{{appURL}}'>{{appURL}}</a></p><p>If you have any questions or need further details, please let us know.</p><p>Best regards,<br>The IVO Team</p>"
  // }
  


}