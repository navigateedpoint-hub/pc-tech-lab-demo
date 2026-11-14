/* Station 2 guided demo: OS Installation. Windows 11 25H2 and Ubuntu 26.04 LTS. */
(function(){
const H=S2Scenes.HASH, ISO=S2Scenes.ISO;
const init=tr=>()=>({track:tr,usb:{loc:'desk',content:null},iso:{win:false,ubuntu:false,verified:false},machine:'work',poweredOn:false,
  lap:{app:null},rufus:{},mon:'off',fw:{},w:{},u:{}});
function make(tr){
  const b=[]; const add=(ch,t,say,o={})=>b.push(Object.assign({ch,t,say},o));
  const W=tr==='W', key=W?'win':'ubuntu';
  const set=(k,obj)=>s=>{ s[k]=Object.assign({},s[k],obj); };

  /* ===== 1. Make the bootable USB ===== */
  add('media','Two computers',W?'The working laptop downloads Windows 11 and writes it to a USB drive. The new PC from Station 1 then installs from that drive.':'The working laptop downloads Ubuntu and writes it to a USB drive. The new PC then installs from that drive.',{scene:'desk'});
  add('media','Check what you need','Open each item to see what it does and what it looks like.',{scene:'intro',explore:true,items:[['laptop','Working laptop'],['usbdrive','USB flash drive'],['iso-file','Installer image (ISO)'],['pc','New PC (Station 1)'],['monitor','Monitor']]});
  add('media','Open the browser','Download the installer only from the official site.',{scene:'lap',target:'app-browser',label:'Browser',act:set('lap',{app:'browser'}),
    tip:'Images from file-sharing or torrent sites often carry malware or pre-activated cracks.'});
  if(W){
    add('media','Choose the download','Select “Windows 11 (multi-edition ISO for x64 devices)”.',{scene:'lap',target:'dl-edition',label:'Select Download',act:set('lap',{edition:true}),ok:'One ISO holds several editions; the edition is chosen during setup.'});
    add('media','Choose the language','Pick the product language. English International suits most offices in the Philippines.',{scene:'lap',target:'dl-lang',label:'Language',act:set('lap',{lang:true})});
    add('media','Download it','Click “64-bit Download”. The file is about 6.4 GB.',{scene:'lap',target:'dl-go',label:'64-bit Download',act:s=>{s.lap=Object.assign({},s.lap,{downloaded:true}); s.iso.win=true;},ok:ISO.win+' is saved in Downloads.'});
  } else {
    add('media','Download Ubuntu','Download Ubuntu 26.04 LTS. LTS means five years of security updates, the right choice for an office.',{scene:'lap',target:'dl-go',label:'Download 26.04 LTS',act:s=>{s.lap=Object.assign({},s.lap,{downloaded:true}); s.iso.ubuntu=true;},ok:ISO.ubuntu+' is saved in Downloads.'});
  }
  add('media','The published checksum','The download page publishes a SHA-256 checksum: a 64-character fingerprint of the genuine file.',{scene:'lap',target:'dl-hash',label:'Published SHA-256',act:s=>{},ok:'Keep this page open. You will compare it with the file on disk.'});
  add('media','Open the Terminal','Open Terminal (PowerShell) on the laptop.',{scene:'lap',target:'app-terminal',label:'Terminal',act:set('lap',{app:'terminal'})});
  add('media','Calculate the checksum',W?'Run <b>Get-FileHash</b> on the downloaded ISO.':'Run <b>certutil -hashfile</b> on the downloaded ISO.',{scene:'lap',target:'term-line',label:'Run the command ↵',act:set('lap',{hashed:true})});
  add('media','Compare the two values','Compare the result with the value on the download page, character by character.',{scene:'lap',target:'hash-out',label:'Compare',act:s=>{s.iso.verified=true;},
    ok:'They match: the file is complete and nobody has changed it. One wrong bit would change the whole value.'});
  add('media','Plug in the USB drive','Plug the USB flash drive into the laptop.',{scene:'desk',target:'zone:USB_WORK',label:'Laptop USB port',act:s=>{s.usb.loc='work'; s.machine='work';},
    ok:'At least 8 GB for Windows 11, 4 GB for Ubuntu.',tip:'Writing the image erases everything on the drive. Check nobody needs its files.',photo:'usbdrive'});
  add('media','Open Rufus','Rufus writes the installer to the USB drive and makes it bootable.',{scene:'lap',target:'app-rufus',label:'Rufus',act:set('lap',{app:'rufus'})});
  add('media','Pick the device','Select the USB drive under Device. This is the most important field: whatever is chosen here gets erased.',{scene:'lap',target:'ru-device',label:'Device',act:set('rufus',{device:true}),
    ok:'USB DRIVE (E:), 32 GB.',tip:'Unplug every other external drive first, so only one device can appear.'});
  add('media','Select the ISO','Click SELECT next to Boot selection.',{scene:'lap',target:'ru-select',label:'SELECT',act:set('rufus',{pick:true})});
  add('media','Choose the file','Choose the ISO you just verified.',{scene:'lap',target:'pick-iso',label:ISO[key],act:set('rufus',{pick:false,iso:true}),ok:'Rufus reads the image and fills in the label and file system.'});
  add('media','GPT for UEFI','Set Partition scheme to <b>GPT</b>. Target system changes to <b>UEFI (non CSM)</b>.',{scene:'lap',target:'ru-scheme',label:'Partition scheme',act:set('rufus',{gpt:true}),
    ok:'Modern PCs boot in UEFI mode, and UEFI boots from GPT. MBR would make a drive that only starts in old legacy mode.'});
  add('media','Start','Click START.',{scene:'lap',target:'ru-start',label:'START',act:set('rufus',{dialog:W?'custom':'iso'})});
  if(W) add('media','Customization options','Rufus offers to change Windows setup. Leave every box unticked: a business PC should meet the real requirements. Click OK.',{scene:'lap',target:'ru-ok',label:'OK',act:set('rufus',{dialog:'warn'}),
    tip:'Removing the TPM or Secure Boot requirement is only for old test machines.'});
  else add('media','ISO or DD mode','Keep the recommended <b>ISO Image mode</b> and click OK.',{scene:'lap',target:'ru-ok',label:'OK',act:set('rufus',{dialog:'warn'})});
  add('media','The data-loss warning','Rufus warns that everything on the drive will be destroyed. You checked it is the right drive, so click OK.',{scene:'lap',target:'ru-ok',label:'OK',
    act:s=>{s.rufus=Object.assign({},s.rufus,{dialog:null,done:true}); s.usb.content=key;},ok:'A few minutes later the status bar turns green: READY.'});
  add('media','Eject safely','Click the USB icon in the corner of the taskbar.',{scene:'lap',target:'tray-usb',label:'Safely Remove Hardware',act:set('lap',{ejectMenu:true})});
  add('media','Eject the drive','Choose Eject USB DRIVE (E:).',{scene:'lap',target:'eject',label:'Eject',act:set('lap',{ejected:true,ejectMenu:false}),ok:'Safe To Remove Hardware: anything still in the write cache has been written.'});
  add('media','Unplug it','Now pull the USB drive out of the laptop.',{scene:'desk',target:'zone:USB_WORK',label:'Unplug',act:s=>{s.usb.loc='desk'; s.lap=Object.assign({},s.lap,{app:null});},ok:'The bootable installer is ready.'});

  /* ===== 2. Connect and power on ===== */
  add('connect','Into the new PC','Plug the USB drive into the new PC.',{scene:'desk',target:'zone:USB_LAB',label:'Front USB',act:s=>{s.usb.loc='lab'; s.machine='lab';},
    ok:'It must be connected before the PC starts, or the firmware will not list it.',tip:'If a front port does not work, use a rear port on the motherboard.'});
  add('connect','Power on','Press the power button.',{scene:'desk',target:'zone:POWER_BTN',label:'Power button',act:s=>{s.poweredOn=true; s.mon='post';},ok:'The firmware runs its self-test and shows its start-up screen.'});

  /* ===== 3. Firmware ===== */
  add('firmware','Enter UEFI setup','The start-up screen shows the keys for this board: DEL for setup, F11 for the boot menu. Press Delete.',{scene:'mon',target:'key-del',label:'Del',act:s=>{s.mon='ez';},
    ok:'UEFI setup opens in EZ Mode.',tip:'Other brands use F2, F10 or Esc. If you miss it, restart and press the key repeatedly.'});
  add('firmware','Advanced mode','EZ Mode is only a summary. Press F7 for the full menus.',{scene:'mon',target:'key-f7',label:'F7',act:s=>{s.mon='adv-sec';}});
  if(W) add('firmware','Turn on TPM','Windows 11 needs TPM 2.0. On Intel boards it is built into the CPU as <b>PTT</b>. Set it to Enabled.',{scene:'mon',target:'opt-ptt',label:'Intel PTT',act:set('fw',{ptt:true}),
    ok:'TPM stores keys in hardware for BitLocker and Windows Hello. AMD calls it fTPM.'});
  add('firmware','Turn on Secure Boot','Set Secure Boot to Enabled.',{scene:'mon',target:'opt-sb',label:'Secure Boot',act:set('fw',{sb:true}),
    ok:W?'Only signed boot code can start, which blocks bootkits. The Windows installer is signed.':'Ubuntu ships a signed boot loader, so Secure Boot can stay on.'});
  add('firmware','Open the boot settings','Go to the Advanced tab.',{scene:'mon',target:'tab-boot',label:'Advanced',act:s=>{s.mon='adv-boot';}});
  add('firmware','UEFI, not CSM','Set BIOS UEFI/CSM Mode to <b>UEFI</b>.',{scene:'mon',target:'opt-csm',label:'UEFI/CSM Mode',act:set('fw',{csmOff:true}),
    ok:'CSM imitates an old BIOS and forces legacy boot. Windows 11 needs UEFI.'});
  add('firmware','Save & Exit','Open Save & Exit.',{scene:'mon',target:'tab-exit',label:'Save & Exit',act:s=>{s.mon='adv-exit';}});
  add('firmware','Save the changes','Choose Save Changes and Reboot.',{scene:'mon',target:'opt-save',label:'Save Changes and Reboot',act:set('fw',{confirm:true})});
  add('firmware','Confirm','Check the list of changes, then choose Yes.',{scene:'mon',target:'opt-yes',label:'Yes',act:s=>{s.fw=Object.assign({},s.fw,{confirm:false,saved:true}); s.mon='post';},ok:'Changes only apply after saving. The PC restarts.'});

  /* ===== 4. Boot from the USB ===== */
  add('bootmedia','Open the boot menu','This time press F11 for the one-time boot menu.',{scene:'mon',target:'key-f11',label:'F11',act:s=>{s.mon='bootmenu';},ok:'The boot menu starts a device once, without changing the saved boot order.'});
  add('bootmedia','Choose the UEFI entry','Choose the entry that starts with <b>UEFI:</b>.',{scene:'mon',target:'boot-uefi-usb',label:'UEFI: USB DRIVE',act:s=>{s.mon=W?'anykey':'grub';},
    ok:'“UEFI:” means the installer starts in UEFI mode.'});
  if(W) add('bootmedia','Press any key','A prompt appears for a few seconds. Press a key now.',{scene:'mon',target:'key-any',label:'Press a key',act:s=>{s.mon='w-lang';},
    ok:'Windows Setup loads from the USB.',tip:'Miss it and the PC tries the empty SSD instead.'});
  else add('bootmedia','GRUB menu','GRUB is the Linux boot loader. Choose <b>Try or Install Ubuntu</b>.',{scene:'mon',target:'grub-install',label:'Try or Install Ubuntu',act:s=>{s.mon='u-lang';},ok:'The live system loads into memory and starts the installer.'});

  if(W){
    /* ===== 5. Windows Setup ===== */
    add('setup','Time and currency format','Set Time and currency format to <b>English (Philippines)</b>.',{scene:'mon',target:'ws-time',label:'Time and currency',act:set('w',{time:true}),ok:'This sets how dates, numbers and money are shown.'});
    add('setup','Next','Click Next.',{scene:'mon',target:'ws-next',label:'Next',act:s=>{s.mon='w-kb';}});
    add('setup','Keyboard','The keyboard is US. Click Next.',{scene:'mon',target:'ws-next',label:'Next',act:s=>{s.mon='w-opt';},tip:'A wrong layout types the wrong symbols in passwords.'});
    add('setup','Clean install','Choose <b>Install Windows 11</b>.',{scene:'mon',target:'ws-install',label:'Install Windows 11',act:set('w',{install:true}),ok:'“Repair my PC” is only for fixing an existing Windows.'});
    add('setup','Confirm','Tick “I agree everything will be deleted”.',{scene:'mon',target:'ws-agree',label:'I agree',act:set('w',{agree:true}),tip:'On a customer’s PC, back up their files before this step.'});
    add('setup','Next','Click Next.',{scene:'mon',target:'ws-next',label:'Next',act:s=>{s.mon='w-key';}});
    add('setup','Product key','This PC has no key in its firmware yet. Choose “I don’t have a product key”; Windows can be activated after installation.',{scene:'mon',target:'ws-nokey',label:'I don’t have a product key',act:s=>{s.mon='w-ed';},
      ok:'Brand-name PCs sold with Windows skip this screen: their key is stored in the firmware.',tip:'Very cheap keys from grey-market sellers are often not valid licences.'});
    add('setup','Choose the edition','Select <b>Windows 11 Pro</b>, the edition the office is licensed for.',{scene:'mon',target:'ws-pro',label:'Windows 11 Pro',act:set('w',{pro:true}),ok:'Installing a different edition from the licence means it will never activate.'});
    add('setup','Next','Click Next.',{scene:'mon',target:'ws-next',label:'Next',act:s=>{s.mon='w-lic';}});
    add('setup','Licence terms','Setup cannot continue without accepting the licence. Click Accept.',{scene:'mon',target:'ws-accept',label:'Accept',act:s=>{s.mon='w-disk';}});
    /* ===== 6. Disk ===== */
    add('disk','Read the disk screen','Disk 0 is the new 1 TB SSD. It is empty: all of it is unallocated space.',{scene:'mon',
      tip:'On a used PC you would delete the old partitions here. Check the disk number and size first, and make sure backups exist.'});
    add('disk','Select the space','Select Disk 0 Unallocated Space.',{scene:'mon',target:'ws-disk0',label:'Disk 0',act:set('w',{disk:true}),ok:'Setup creates the partitions itself: EFI System, MSR, Windows and Recovery.'});
    add('disk','Next','Click Next.',{scene:'mon',target:'ws-next',label:'Next',act:s=>{s.mon='w-ready';}});
    add('disk','Install','Check the summary, then click Install.',{scene:'mon',target:'ws-installgo',label:'Install',act:s=>{s.mon='w-installing'; s.w=Object.assign({},s.w,{pct:38});}});
    /* ===== 7. Install ===== */
    add('install','Files are installing','Setup copies Windows to the SSD, adds features and drivers. The PC restarts on its own.',{scene:'mon',act:s=>{s.w=Object.assign({},s.w,{pct:100});},
      tip:'Never switch the PC off during installation.'});
    add('install','Remove the USB','When the PC restarts, take the USB drive out.',{scene:'desk',target:'zone:USB_LAB',label:'Remove the USB',act:s=>{s.usb.loc='desk'; s.mon='o-region';},
      ok:'The PC now starts from the SSD.',tip:'If the USB stays in and you press a key at the prompt, setup starts again from the beginning.'});
    /* ===== 8. OOBE ===== */
    add('oobe','Country or region','Select <b>Philippines</b>.',{scene:'mon',target:'oo-ph',label:'Philippines',act:set('w',{ph:true}),ok:'This sets the date, time, currency and store.'});
    add('oobe','Confirm','Click Yes.',{scene:'mon',target:'oo-yes',label:'Yes',act:s=>{s.mon='o-kb';}});
    add('oobe','Keyboard layout','US is correct. Click Yes.',{scene:'mon',target:'oo-yes',label:'Yes',act:s=>{s.mon='o-kb2';}});
    add('oobe','Second layout','No second layout is needed. Click Skip.',{scene:'mon',target:'oo-skip',label:'Skip',act:s=>{s.mon='o-net';}});
    add('oobe','Network','The Ethernet cable is connected. Click Next.',{scene:'mon',target:'oo-next',label:'Next',act:s=>{s.mon='o-name';},
      ok:'Setup downloads updates and needs internet to sign in.',tip:'If no network appears on a Wi-Fi-only PC, its wireless driver is missing: use Ethernet.'});
    add('oobe','Name the device','Type <b>LAB-PC-01</b>, following the office naming plan.',{scene:'mon',target:'oo-name',label:'Name',act:set('w',{name:true}),ok:'A clear name identifies the PC on the network and in your inventory.'});
    add('oobe','Next','Click Next. The PC restarts to apply the name.',{scene:'mon',target:'oo-next',label:'Next',act:s=>{s.mon='o-how';}});
    add('oobe','Personal or work','Choose <b>Set up for personal use</b> for this demo.',{scene:'mon',target:'oo-personal',label:'Personal use',act:set('w',{personal:true}),tip:'A company PC is usually set up for work or school with the company account.'});
    add('oobe','Next','Click Next.',{scene:'mon',target:'oo-next',label:'Next',act:s=>{s.mon='o-acct';}});
    add('oobe','Microsoft account','Type the account email.',{scene:'mon',target:'oo-email',label:'Email',act:set('w',{email:true})});
    add('oobe','Next','Click Next.',{scene:'mon',target:'oo-next',label:'Next',act:s=>{s.mon='o-pass';}});
    add('oobe','Password','Type the password.',{scene:'mon',target:'oo-pw',label:'Password',act:set('w',{pw:true})});
    add('oobe','Sign in','Click Sign in.',{scene:'mon',target:'oo-signin',label:'Sign in',act:s=>{s.mon='o-pin';}});
    add('oobe','Create a PIN','Type a PIN, then confirm it.',{scene:'mon',target:'oo-pin',label:'PIN',act:set('w',{pin:true}),ok:'A PIN only works on this device, so a stolen PIN is far less useful than a stolen password.'});
    add('oobe','OK','Click OK.',{scene:'mon',target:'oo-ok',label:'OK',act:s=>{s.mon='o-priv';}});
    add('oobe','Privacy settings','Review each setting with the user. Here only what is needed is on. Click Accept.',{scene:'mon',target:'oo-accept',label:'Accept',act:s=>{s.mon='desk';},ok:'The Windows desktop appears.'});
    /* ===== 9. Verify ===== */
    add('verify','Open Settings','Check what was installed.',{scene:'mon',target:'wd-settings',label:'Settings',act:s=>{s.mon='about';}});
    add('verify','Device specifications','Name LAB-PC-01, the i5-12400 and 16 GB of RAM: everything from Station 1 is recognised.',{scene:'mon',target:'ab-spec',label:'Device specifications',act:s=>{}});
    add('verify','Windows specifications','Windows 11 Pro, version 25H2, and activated.',{scene:'mon',target:'ab-win',label:'Windows specifications',act:s=>{},tip:'Never hand over a PC that says “not activated”.'});
    add('verify','Device Manager','Open Device Manager.',{scene:'mon',target:'wd-devmgr',label:'Device Manager',act:s=>{s.mon='devmgr';}});
    add('verify','Check the drivers','A yellow mark means a missing driver. Network, graphics and chipset matter most.',{scene:'mon',target:'dm-ok',label:'No warnings',act:s=>{},ok:'Every device has a driver.',
      tip:'Some chipset and Wi-Fi drivers come from the board maker’s website, not Windows Update.'});
    add('verify','Windows Update','Open Settings again, at Windows Update.',{scene:'mon',target:'wd-settings',label:'Settings',act:s=>{s.mon='update';}});
    add('verify','Check for updates','A fresh install is already behind on security fixes.',{scene:'mon',target:'up-check',label:'Check for updates',act:set('w',{upd:'found'})});
    add('verify','Install the updates','Click Download &amp; install all, then restart when asked.',{scene:'mon',target:'up-install',label:'Download & install',act:set('w',{upd:'done'}),ok:'Up to date. The PC is ready to hand over, and ready for Station 3.'});
  } else {
    /* ===== Ubuntu installer ===== */
    add('installer','Language','Choose <b>English</b>.',{scene:'mon',target:'u-en',label:'English',act:set('u',{en:true})});
    add('installer','Next','Click Next.',{scene:'mon',target:'u-next',label:'Next',act:s=>{s.mon='u-access';}});
    add('installer','Accessibility','Nothing to change. Click Next.',{scene:'mon',target:'u-next',label:'Next',act:s=>{s.mon='u-kb';}});
    add('installer','Test the keyboard','Type a few letters and symbols in the test box.',{scene:'mon',target:'u-kbtest',label:'Test box',act:set('u',{kbtest:true}),ok:'The keys type what is printed on them, so passwords will work.'});
    add('installer','Next','Click Next.',{scene:'mon',target:'u-next',label:'Next',act:s=>{s.mon='u-net';}});
    add('installer','Network','Use the wired connection.',{scene:'mon',target:'u-wired',label:'Wired',act:set('u',{wired:true}),ok:'The installer can fetch updates while it works.'});
    add('installer','Next','Click Next.',{scene:'mon',target:'u-next',label:'Next',act:s=>{s.mon='u-what';}});
    add('installer','Install, not try','Choose <b>Install Ubuntu</b>.',{scene:'mon',target:'u-install',label:'Install Ubuntu',act:set('u',{install:true}),tip:'“Try Ubuntu” runs from the USB only. Nothing is installed.'});
    add('installer','Next','Click Next.',{scene:'mon',target:'u-next',label:'Next',act:s=>{s.mon='u-how';}});
    add('installer','Interactive installation','You answer each question yourself.',{scene:'mon',target:'u-inter',label:'Interactive',act:set('u',{inter:true})});
    add('installer','Next','Click Next.',{scene:'mon',target:'u-next',label:'Next',act:s=>{s.mon='u-apps';}});
    add('installer','Apps','Choose the default selection.',{scene:'mon',target:'u-default',label:'Default selection',act:set('u',{defApps:true})});
    add('installer','Next','Click Next.',{scene:'mon',target:'u-next',label:'Next',act:s=>{s.mon='u-prop';}});
    add('installer','Third-party drivers','Tick third-party software for graphics and Wi-Fi.',{scene:'mon',target:'u-3rd',label:'Third-party software',act:set('u',{third:true}),ok:'Some Wi-Fi and graphics chips need drivers that are not open source.'});
    add('installer','Media formats','Tick support for additional media formats.',{scene:'mon',target:'u-media',label:'Media formats',act:set('u',{media:true})});
    add('installer','Next','Click Next.',{scene:'mon',target:'u-next',label:'Next',act:s=>{s.mon='u-disk';}});
    /* ===== partition ===== */
    add('udisk','Manual installation','Choose <b>Manual installation</b> to see and create the partitions yourself.',{scene:'mon',target:'u-manual',label:'Manual installation',act:set('u',{manual:true}),tip:'“Erase disk” is quicker, but you should understand what it creates.'});
    add('udisk','Next','Click Next.',{scene:'mon',target:'u-next',label:'Next',act:s=>{s.mon='u-part';}});
    add('udisk','EFI System Partition','Add a partition of about 1 GB, used as <b>EFI System Partition</b>.',{scene:'mon',target:'u-add',label:'Add partition',act:set('u',{esp:true}),ok:'UEFI loads the boot loader from this small FAT32 partition.'});
    add('udisk','Root partition','Add a second partition with the rest of the space: <b>ext4</b>, mounted at <b>/</b>.',{scene:'mon',target:'u-add',label:'Add partition',act:set('u',{root:true}),ok:'The whole system lives under /. Ubuntu uses a swap file, so no swap partition is needed.'});
    add('udisk','Next','Click Next.',{scene:'mon',target:'u-next',label:'Next',act:s=>{s.mon='u-acct';}});
    /* ===== account, install ===== */
    add('uaccount','Create the account','Fill in your name, the computer’s name, a lowercase username and a password.',{scene:'mon',target:'u-name',label:'Your name',act:set('u',{acct:true}),ok:'The first user can administer the system with sudo.',tip:'Usernames must be lowercase with no spaces.'});
    add('uaccount','Next','Click Next.',{scene:'mon',target:'u-next',label:'Next',act:s=>{s.mon='u-tz';}});
    add('uaccount','Timezone','Select <b>Asia/Manila</b>.',{scene:'mon',target:'u-tzf',label:'Timezone',act:set('u',{tz:true}),ok:'Correct time matters for logs, certificates and updates.'});
    add('uaccount','Next','Click Next.',{scene:'mon',target:'u-next',label:'Next',act:s=>{s.mon='u-review';}});
    add('uaccount','Review and install','Read the partition summary: this is the last point before the disk is changed. Click Install.',{scene:'mon',target:'u-installgo',label:'Install',act:s=>{s.mon='u-installing'; s.u=Object.assign({},s.u,{pct:40});}});
    add('uaccount','Installing','The files are copied to the SSD.',{scene:'mon',act:s=>{s.u=Object.assign({},s.u,{pct:100});}});
    add('uaccount','Restart now','Click Restart now.',{scene:'mon',target:'u-restart',label:'Restart now',act:s=>{s.mon='u-remove';}});
    add('uaccount','Remove the USB','Take the USB drive out of the PC.',{scene:'desk',target:'zone:USB_LAB',label:'Remove the USB',act:s=>{s.usb.loc='desk';},tip:'With the USB still in, the installer would simply start again.'});
    add('uaccount','Press Enter','Press Enter to restart.',{scene:'mon',target:'key-enter',label:'Enter',act:s=>{s.mon='u-login';}});
    add('uaccount','Log in','Type the password to log in.',{scene:'mon',target:'ul-pw',label:'Password',act:s=>{s.u=Object.assign({},s.u,{logged:true}); s.mon='u-desk';},ok:'The Ubuntu desktop appears.'});
    /* ===== verify ===== */
    add('verify','Open Settings','Check what was installed.',{scene:'mon',target:'ud-settings',label:'Settings',act:s=>{s.mon='u-about';}});
    add('verify','Hardware','16 GiB of memory, the i5-12400 and the 1 TB disk are all recognised.',{scene:'mon',target:'ua-spec',label:'Hardware',act:s=>{}});
    add('verify','System','Ubuntu 26.04 LTS, 64-bit.',{scene:'mon',target:'ua-os',label:'OS',act:s=>{}});
    add('verify','Software Updater','Open Software Updater.',{scene:'mon',target:'ud-updater',label:'Software Updater',act:s=>{s.mon='u-upd';}});
    add('verify','Install updates','A new install is already behind on security updates. Click Install Now.',{scene:'mon',target:'uu-install',label:'Install Now',act:set('u',{upd:'done'}),ok:'Up to date. The PC is ready to hand over.'});
  }
  return b;
}
const CH_W=[
  {id:'media',title:'Make the bootable USB',ends:'A verified Windows 11 installer on a USB drive, written for UEFI and safely ejected.'},
  {id:'connect',title:'Connect and power on',ends:'The USB is in the new PC and it is at its start-up screen.'},
  {id:'firmware',title:'Check the firmware (UEFI)',ends:'TPM on, Secure Boot on, UEFI mode, settings saved.'},
  {id:'bootmedia',title:'Boot from the USB',ends:'Windows Setup is running from the USB in UEFI mode.'},
  {id:'setup',title:'Windows Setup screens',ends:'Language, clean install, edition and licence done.'},
  {id:'disk',title:'Prepare the disk',ends:'Windows is installing to the empty SSD.'},
  {id:'install',title:'Install and first restart',ends:'Files installed, USB removed, the PC starts from the SSD.'},
  {id:'oobe',title:'First-run setup (OOBE)',ends:'Region, network, name, account, PIN and privacy done. The desktop appears.'},
  {id:'verify',title:'Verify and update',ends:'Specifications, activation and drivers checked; updates installed.'},
];
const CH_U=[
  {id:'media',title:'Make the bootable USB',ends:'A verified Ubuntu installer on a USB drive, safely ejected.'},
  {id:'connect',title:'Connect and power on',ends:'The USB is in the new PC and it is at its start-up screen.'},
  {id:'firmware',title:'Check the firmware (UEFI)',ends:'Secure Boot on, UEFI mode, settings saved.'},
  {id:'bootmedia',title:'Boot from the USB',ends:'The Ubuntu installer is running from the USB.'},
  {id:'installer',title:'Ubuntu installer screens',ends:'Language, network and app choices made.'},
  {id:'udisk',title:'Partition the disk',ends:'An EFI System Partition and an ext4 root partition are ready.'},
  {id:'uaccount',title:'Account, install and restart',ends:'Ubuntu installed, the USB removed, the new system started.'},
  {id:'verify',title:'Verify and update',ends:'Hardware and release checked; updates installed.'},
];
const APP={browser:'Browser',terminal:'Terminal (PowerShell)',rufus:'Rufus',explorer:'File Explorer'};
function monName(m,W){
  if(m==='off') return ['Screen off'];
  if(m==='post') return ['Start-up screen (POST)'];
  if(m==='ez') return ['UEFI setup','EZ Mode'];
  if(m==='adv-sec') return ['UEFI setup','Advanced','Security'];
  if(m==='adv-boot') return ['UEFI setup','Advanced','Windows OS Configuration'];
  if(m==='adv-exit') return ['UEFI setup','Advanced','Save & Exit'];
  if(m==='bootmenu') return ['Boot menu (F11)'];
  if(m==='anykey') return ['Booting from the USB'];
  if(m==='grub') return ['GRUB boot menu'];
  if(/^w-/.test(m)) return ['Windows Setup (from the USB)'];
  if(/^o-/.test(m)) return ['Windows first-run setup'];
  if(m==='desk') return ['Windows desktop'];
  if(m==='about') return ['Windows','Settings','About'];
  if(m==='update') return ['Windows','Settings','Windows Update'];
  if(m==='devmgr') return ['Windows','Device Manager'];
  if(m==='u-remove') return ['Restarting'];
  if(m==='u-login') return ['Ubuntu','Login screen'];
  if(m==='u-desk') return ['Ubuntu desktop'];
  if(m==='u-about') return ['Ubuntu','Settings','About'];
  if(m==='u-upd') return ['Ubuntu','Software Updater'];
  if(/^u-/.test(m)) return ['Ubuntu installer (from the USB)'];
  return [];
}
function where(s,b){
  if(b.scene==='intro') return ['Materials table'];
  if(b.scene==='desk') return ['Desk','Laptop · USB drive · new PC'];
  if(b.scene==='lap') return ['Working laptop'].concat(s.lap.app?[APP[s.lap.app]]:['Desktop']);
  if(b.scene==='mon') return ['New PC’s monitor'].concat(monName(s.mon));
  return [];
}
const INSTALLED={'Download it':'Windows 11 download ISO page Microsoft','Download Ubuntu':'Ubuntu desktop download page','Compare the two values':'Get-FileHash SHA256 PowerShell output',
  'Plug in the USB drive':'USB flash drive plugged into laptop','GPT for UEFI':'Rufus GPT UEFI non CSM Windows 11','The data-loss warning':'Rufus READY status bar green','Eject the drive':'Safe To Remove Hardware Windows 11',
  'Into the new PC':'USB flash drive plugged into PC front port','Enter UEFI setup':'MSI Click BIOS EZ mode','Turn on TPM':'MSI BIOS Intel Platform Trust Technology PTT enabled','Turn on Secure Boot':'MSI BIOS Secure Boot enabled',
  'UEFI, not CSM':'MSI BIOS UEFI CSM mode','Choose the UEFI entry':'MSI boot menu F11 UEFI USB','GRUB menu':'Ubuntu GRUB Try or Install Ubuntu','Clean install':'Windows 11 24H2 setup Select setup option',
  'Select the space':'Windows 11 setup Disk 0 unallocated space','Files are installing':'Installing Windows 11 progress','Country or region':'Windows 11 OOBE country region','Create a PIN':'Windows 11 OOBE create PIN',
  'Privacy settings':'Windows 11 OOBE privacy settings','Windows specifications':'Windows 11 Settings About Windows specifications','Check the drivers':'Device Manager Windows 11',
  'Manual installation':'Ubuntu 24.04 installer manual installation partitions','Root partition':'Ubuntu installer ext4 root EFI partition','Review and install':'Ubuntu installer review your choices','Install updates':'Ubuntu Software Updater'};
function withPhotos(list){ list.forEach(x=>{ if(INSTALLED[x.t]) x.photo='q:'+INSTALLED[x.t]; }); return list; }
Demo.start({
  id:'s2', station:'Station 2', title:'OS Installation',
  tracks:{W:{name:'Windows 11 25H2',chapters:CH_W,beats:withPhotos(make('W')),init:init('W')},U:{name:'Ubuntu 26.04 LTS',chapters:CH_U,beats:withPhotos(make('U')),init:init('U')}},
  where,
  render:S2Scenes.render,
  finishText:'You have made a bootable USB, set the firmware and installed and checked a complete operating system.',
  next:{href:'../2-Set-up-Computer-Networks/station3.html',label:'Station 3: Cable Termination'},
});
})();
