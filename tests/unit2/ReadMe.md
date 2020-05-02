Unit tests with [alsatian](https://github.com/alsatian-test/alsatian).

So far I liked _alsatian_ most, because it is very similar to NUnit which I love.  
Now I learned about _jest_ and there are nearly no features that _alsatian_ has and _jest_ doesn't have. Some features in setup are with _jest_ more streamlined (no need for `tsconfig-paths/register`, generating results and displaying in the stdout), so maybe let's switch over.
Especially since for vue-tests _jest_ is used, hence only one test-framework would be pulled in instead of two.

When it comes to mocking _jest_ has good built-in solutions to stub out behavior.  
With proper design (dependency injection (in js??? :wink:)) this would be no problem in _alsatian_, too.
