namespace BuntesBegegnen.Api.Util;

public class Deferral : IDisposable
{
    private readonly Action _disposeAction;
    private bool _isDisarmed;

    public Deferral(Action disposeAction) => _disposeAction = disposeAction;

    public void Disarm() => _isDisarmed = true;

    public void Dispose()
    {
        if (_isDisarmed == false)
        {
            _disposeAction();
        }

        GC.SuppressFinalize(this);
    }
}
