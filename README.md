# SercoumFiller

An advanced browser extension designed to streamline form completion on Sercom platforms. This intelligent tool automatically generates and inserts realistic international demographic data, saving time and eliminating manual data entry errors.

![SercoumFiller](icons/icon128.png)

## 🌟 Key Features

- **Intelligent Form Detection**: Automatically identifies and targets Sercom form fields with precision
- **International Data Generation**: Creates realistic data for 10 countries with authentic naming conventions
- **Multi-language Support**: Handles Spanish form fields seamlessly with proper translations
- **Smart Field Filling**: Robust algorithms for handling various input types including dropdowns and date selectors
- **Resilient Architecture**: Multiple fallback mechanisms ensure reliable form completion even with site updates
- **Memory Optimization**: Efficient data generation with minimal resource utilization
- **Debug Mode**: Optional diagnostic tools for troubleshooting (disabled by default)

## 🌎 Supported Countries

The extension generates authentic data for the following countries:

| Country | Features |
|---------|----------|
| Germany | 25 male/female names, surnames, German passport format |
| France | 25 male/female names, surnames, French passport format |
| United Kingdom | 25 male/female names, surnames, UK passport format |
| United States | 25 male/female names, surnames, US passport format |
| Italy | 25 male/female names, surnames, Italian passport format |
| Brazil | 25 male/female names, surnames, Brazilian passport format (FD prefix) |
| Australia | 25 male/female names, surnames, Australian passport format |
| Morocco | 25 male/female names, surnames, Moroccan passport format |
| Algeria | 25 male/female names, surnames, Algerian passport format |
| South Africa | 25 male/female names, surnames, South African passport format |

## 🛠️ Advanced Data Generation

### Personal Information
- **Names**: Culturally authentic first names (25 male/25 female per country)
- **Surnames**: Country-specific surnames with optional second surname (30% probability)
- **Gender**: Properly translated to Spanish ("Hombre"/"Mujer")
- **Nationality**: Automatically translated to Spanish equivalents

### Document & Identity
- **Document Types**: Support for passport and other identity documents
- **ID Numbers**: Country-specific passport formats with proper letter/number patterns
- **Birth Dates**: Customizable age ranges (default: 18-80 years) with uniqueness tracking

## 💻 Installation

1. Download the SercoumFiller extension files
2. Open your browser's extension management page:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the directory containing the extension
5. SercoumFiller is now ready to use

## 🚀 Usage Guide

### Basic Usage
1. Navigate to any Sercom form page
2. Click the SercoumFiller icon in your toolbar
3. Choose to generate random data or customize fields manually
4. Click "Insert Data" to automatically complete the form

### Customization Options
- **Custom Age Range**: Generate profiles within specific age parameters
- **Gender Selection**: Choose specific gender for generated profiles
- **Nationality Control**: Select specific countries for data generation
- **Surname Options**: Generate profiles with or without second surnames

## ⚙️ Extension Structure

SercoumFiller consists of the following key components:

- **Popup Interface**: User-friendly form for generating and inputting data
- **Content Script**: Handles the actual form filling on Sercom pages
- **Data Generator**: Creates realistic personal information based on country
- **Utilities**: Helper functions for data formatting and manipulation

## 🔒 Security & Privacy

- **Local Processing**: All data is generated locally in your browser
- **No Data Collection**: SercoumFiller does not transmit or store any personal information
- **No External Dependencies**: Operates independently without calling external APIs
- **Permissions**: Only requests essential permissions to function properly

## 🔧 Troubleshooting

If you encounter issues with the form filling process:

1. **Field Detection**: Some dynamically loaded fields may require a brief pause before filling
2. **Dropdown Selection**: Complex dropdown implementations might need multiple attempts
3. **Site Updates**: If the site structure changes significantly, update may be required

## 📋 Technical Details

SercoumFiller employs sophisticated techniques for reliable form interaction:

- **Vue.js Integration**: Special handling for Vue.js-powered forms
- **Multiple Selection Strategies**: Various approaches to ensure proper dropdown selection
- **Event Propagation**: Proper event dispatching to trigger form validation
- **Element Finding**: Robust element location using multiple selector strategies
- **Optimized Memory Usage**: Efficient data storage with automatic cleanup

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

*SercoumFiller: Developed with ❤️ for efficiency and reliability. Making data entry tasks simple and error-free.* 