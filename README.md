# ExamAnalyser 📊

A specialized web application built with Angular for analyzing Romanian national exams (Evaluarea Națională and Bacalaureat) and helping students make informed decisions about their high school applications.

## 🎯 Overview

ExamAnalyser is a comprehensive tool designed specifically for Romanian students taking national exams. The application helps students predict which high schools they can join based on their exam results and provides detailed statistics about admission trends, grade distributions, and contestation outcomes.

## ✨ Features

- **High School Prediction**: Predict which high schools you can join based on your Evaluarea Națională or Bacalaureat scores
- **Admission Statistics**: View detailed statistics about class capacity and admission trends
- **Grade Analysis**: Compare grades before and after contestations ("contestație")
- **Class Capacity Insights**: See how full different high school classes are likely to be at various grade levels
- **Historical Data**: Analyze trends from previous years' admission cycles
- **School Comparison**: Compare multiple high schools and their admission requirements
- **Visual Analytics**: Interactive charts showing grade distributions and admission statistics

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- Angular CLI (version 18.2.7 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/VoinaRares/ExamAnalyser.git
cd ExamAnalyser
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

4. Navigate to `http://localhost:4200/` in your browser. The application will automatically reload when you make changes to the source files.

## 🛠️ Development

### Available Scripts

- **`ng serve`** - Start development server on `http://localhost:4200/`
- **`ng build`** - Build the project for production (artifacts stored in `dist/` directory)
- **`ng test`** - Run unit tests via [Karma](https://karma-runner.github.io)
- **`ng e2e`** - Run end-to-end tests (requires additional e2e testing package)
- **`ng generate component component-name`** - Generate a new component
- **`ng generate directive|pipe|service|class|guard|interface|enum|module`** - Generate other Angular artifacts

### Project Structure

```
ExamAnalyser/
├── src/
│   ├── app/                 # Application components and modules
│   ├── assets/             # Static assets
│   └── environments/       # Environment configurations
├── dist/                   # Build output directory
├── angular.json           # Angular workspace configuration
├── package.json          # Project dependencies
└── README.md            # Project documentation
```

## 📈 Usage

### For Students Taking Evaluarea Națională

1. **Enter Your Grades**: Input your exam scores from Evaluarea Națională
2. **High School Prediction**: See which high schools you're likely to be admitted to
3. **Compare Options**: View statistics for different schools and specializations
4. **Analyze Capacity**: Check how competitive admission is for your preferred schools

### For Students Taking Bacalaureat

1. **University Preparation**: Use your Bacalaureat scores to plan university applications
2. **Grade Impact Analysis**: See how contestations have affected grades in previous years
3. **Statistical Insights**: Compare your performance with national averages
4. **Admission Planning**: Make informed decisions about your educational path

### Key Features in Detail

- **Contestation Analysis**: View historical data on how grades changed after contestations, helping you decide whether to contest your grade
- **Class Capacity Tracking**: See real-time data on how full different high school classes are at various grade thresholds
- **Multi-Year Comparisons**: Compare admission statistics across multiple years to identify trends

## 🧪 Testing

Run the test suite to ensure everything is working correctly:

```bash
# Unit tests
ng test

# End-to-end tests (requires e2e testing package)
ng e2e
```

## 📝 License

This project is open source. Please check the repository for license details.

## 🆘 Support

For support and questions:
- Open an issue in the GitHub repository
- Check the [Angular CLI documentation](https://angular.dev/tools/cli) for Angular-specific questions

## 🔧 Technical Details

- **Framework**: Angular 18.2.7
- **Language**: TypeScript
- **Testing**: Karma + Jasmine
- **Build Tool**: Angular CLI
- **Package Manager**: npm
