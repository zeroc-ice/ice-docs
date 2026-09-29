---
title: Supported Platforms for Ice 3.8.2
---

Ice 3.8.2 is fully tested and supported on the platform, compiler, and environment combinations shown below. Other
platforms and compilers might work as well but have not been tested.

## Operating Systems

| **Operating System**                                                                                                         | **Architecture**                | **Supported Languages**                               |
| ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ----------------------------------------------------- |
| Windows 11, Windows Server 2022, Windows Server 2025                                                                         | x64                             | C++¹, C#, Java, JavaScript, MATLAB², Python           |
| Amazon Linux 2023, Red Hat Enterprise Linux 9, Red Hat Enterprise Linux 10, Debian 12, Debian 13, Ubuntu 24.04, Ubuntu 26.04 | x86_64 (amd64), aarch64 (arm64) | C++, C#, Java, JavaScript, MATLAB², PHP, Python, Ruby |
| macOS 26                                                                                                                     | Apple Silicon                   | C++, C#, Java, JavaScript, PHP, Python, Ruby, Swift   |
| iOS 26                                                                                                                       | arm64                           | C++, Swift                                            |
| Android 14, Android 15, Android 16                                                                                           | All                             | Java                                                  |

¹ Ice for C++ also provides x86 libraries on Windows.

² Ice for MATLAB is only tested on Windows x64 and Ubuntu amd64.

## Language Versions

| **Ice Framework**  | **Min Language Version** | **Compiler, Framework, Runtime Environment**                                               |
| ------------------ | ------------------------ | ------------------------------------------------------------------------------------------ |
| Ice for C++        | C++17                    | Visual Studio 2022 or 2026 (Windows), Default GCC version (Linux), Xcode 26.5 (macOS, iOS) |
| Ice for C#         | C# 12                    | .NET 8.0, .NET 10.0                                                                        |
| Ice for Java       | Java 17                  | JDK/JRE 17, Android SDK 34                                                                 |
| Ice for JavaScript | ECMAScript 2020          | Recent versions of Chrome, Edge, Firefox, Safari, Node.js 22.x LTS                         |
| Ice for MATLAB     | MATLAB R2025b            | MATLAB R2025b                                                                              |
| Ice for PHP        | PHP 8.4                  | PHP 8.4                                                                                    |
| Ice for Python     | Python 3.12              | Python 3.12, Python 3.13, Python 3.14                                                      |
| Ice for Ruby       | Ruby 3.4                 | Ruby 3.4                                                                                   |
| Ice for Swift      | Swift 6.1                | Swift 6.1, Swift 6.2, Swift 6.3                                                            |
