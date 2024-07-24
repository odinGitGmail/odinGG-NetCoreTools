function dotnetNewPrjSelect(){
    return [
        ".NET Aspire Starter 应用程序(aspire-starter)",
        ".NET Aspire 应用主机(aspire-apphost)",
        ".NET Aspire 应用程序(aspire)",
        ".NET Aspire 服务默认值(aspire-servicedefaults)",
        ".NET Aspire 测试项目(aspire-xunit)",
        "API 控制器(apicontroller)",
        "ASP.NET Core gRPC 服务(grpc)",
        "ASP.NET Core Web API(webapi)",
        "ASP.NET Core Web API(webapiaot)",
        "ASP.NET Core Web 应用(webapp)",
        "ASP.NET Core Web 应用(mvc)",
        "ASP.NET Core with Angular(angular)",
        "ASP.NET Core with React.js(react)",
        "ASP.NET Core with React.js and Redux(reactredux)",
        "ASP.NET Core 空(web)",
        "Blazor Server App(blazorserver)",
        "Blazor Web 应用(blazor)",
        "Blazor WebAssembly 应用(blazorwasm)",
        "MSTest Test Project(mstest)",
        "MSTest Playwright Test Project(mstest-playwright)",
        "NUnit 3 Test Project(nunit)",
        "NUnit Playwright Test Project(nunit-playwright)",
        "xUnit Test Project(xunit)",
        "Windows 窗体应用(winforms)",
        "Windows 窗体控件库(winformscontrollib)",
        "Windows 窗体类库(winformslib)",
        "WPF 应用程序(wpf)",
        "WPF 用户控件库(wpfusercontrollib)",
        "WPF 类库(wpflib)",
        "WPF 自定义控件库(wpfcustomcontrollib)",
        "控制台应用(console)",
        "类库(classlib)",
        "辅助角色服务(worker)",
        "Other",
    ];
}

function dotnetNewFileSelect(){
    return [
        "dotnet gitignore 文件(gitignore)",
        "Dotnet 本地工具清单文件(tool-manifest)",
        "EditorConfig 文件(editorconfig)",
        "global.json file(globaljson)",
        "MSBuild Directory.Build.props 文件(buildprops)",
        "MSBuild Directory.Build.targets 文件(buildtargets)",
        "MVC ViewImports(viewimports)",
        "MVC ViewStart(viewstart)",
        "MVC 控制器(mvccontroller)",
        "NuGet 配置(nugetconfig)",
        "NUnit 3 Test Item(nunit-test)",
        "Razor 类库(razorclasslib)",
        "Razor 组件(razorcomponent)",
        "Razor 视图(view)",
        "Razor 页面(page)",
        "Web 配置(webconfig)",
        "协议缓冲区文件(proto)",
        "Other",
    ];
}


function getDotnetPrjType(dotnetPrj){
    var prjType = dotnetPrj.substring(dotnetPrj.indexOf('(')+1,dotnetPrj.indexOf(')')).trim();
    return prjType;
}

function getDotnetFileType(dotnetFile){
    var fileType = dotnetFile.substring(dotnetFile.indexOf('(')+1,dotnetFile.indexOf(')')).trim();
    return fileType;
}

module.exports={
    dotnetNewPrjSelect,
    dotnetNewFileSelect,
    getDotnetPrjType,
    getDotnetFileType,
}