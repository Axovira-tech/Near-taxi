const fs = require('fs');

const filesToProcess = ['about.html', 'services.html', 'contact.html', 'tours.html'];

filesToProcess.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // 1: Brand Name Replace ("Near Taxi" -> "Event Cabs")
    content = content.split('Near Taxi').join('Event Cabs');
    content = content.split('NEAR TAXI').join('EVENT CABS');
    content = content.split('near taxi').join('event cabs');
    content = content.split('Near taxi').join('Event cabs');

    // 2: Fix Desktop Navbar Logo (unbound image in <a> tag)
    const targetDesktopNav = '<a href="index.html"><img src="assets/logo.png" alt="Event Cabs Logo"></a>';
    const replacementDesktopNav = '<a href="index.html"><img src="assets/logo.png" alt="Event Cabs Logo" style="height: 90px; width: auto; transform: scale(1.7); transform-origin: left center; filter: drop-shadow(0px 0px 10px rgba(255, 255, 255, 0.9));"></a>';
    content = content.split(targetDesktopNav).join(replacementDesktopNav);

    // 3: Fix Mobile Header Logo (first 48px occurrence)
    const targetMobileHeader = '<img src="assets/logo.png" alt="Event Cabs Logo"\r\n                        style="height: 48px; width: auto; max-width: 150px; object-fit: contain; margin-left: 0;">';
    const targetMobileHeaderFallback = '<img src="assets/logo.png" alt="Event Cabs Logo"\n                        style="height: 48px; width: auto; max-width: 150px; object-fit: contain; margin-left: 0;">';
    const replacementMobileHeader1 = '<img src="assets/logo.png" alt="Event Cabs Logo"\n                        style="height: 140px; width: auto; max-width: 300px; object-fit: contain; margin-left: -10px;">';
    const replacementMobileHeader2 = '<img src="assets/logo.png" alt="Event Cabs Logo"\n                        style="height: 100px; width: auto; max-width: 250px; object-fit: contain; margin-left: -5px;">';

    // We only replace the first one with `replacementMobileHeader1` and second with `replacementMobileHeader2`
    if (content.includes(targetMobileHeader)) {
        content = content.replace(targetMobileHeader, replacementMobileHeader1);
        content = content.replace(targetMobileHeader, replacementMobileHeader2);
    } else if (content.includes(targetMobileHeaderFallback)) {
        content = content.replace(targetMobileHeaderFallback, replacementMobileHeader1);
        content = content.replace(targetMobileHeaderFallback, replacementMobileHeader2);
    }

    // 4: Fix Footer Logos
    const targetMobileFooter = '<img src="assets/logo.png" alt="Event Cabs Logo" height="52">';
    const replacementMobileFooter = '<img src="assets/logo.png" alt="Event Cabs Logo" style="height: 150px; width: auto; object-fit: contain; filter: drop-shadow(0px 0px 10px rgba(255, 255, 255, 0.9));">';
    content = content.split(targetMobileFooter).join(replacementMobileFooter);

    const targetDesktopFooterHidden = '<img src="assets/logo.png" alt="Event Cabs Logo" height="90" style="margin-bottom: 30px;">';
    const replacementDesktopFooterHidden = '<img src="assets/logo.png" alt="Event Cabs Logo" style="height: 130px; width: auto; margin-bottom: 30px; object-fit: contain; filter: drop-shadow(0px 0px 10px rgba(255, 255, 255, 0.9));">';
    content = content.split(targetDesktopFooterHidden).join(replacementDesktopFooterHidden);

    const targetDesktopFooter = '<img src="assets/logo.png" alt="Event Cabs Logo" height="50">';
    const replacementDesktopFooter = '<img src="assets/logo.png" alt="Event Cabs Logo" style="height: 150px; width: auto; object-fit: contain; filter: drop-shadow(0px 0px 10px rgba(255, 255, 255, 0.9));">';
    content = content.split(targetDesktopFooter).join(replacementDesktopFooter);

    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed exactly using split/replace: ' + file);
});
