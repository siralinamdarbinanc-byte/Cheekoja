import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  declare props: Props;
  declare state: State;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught Error in CheKoja Application:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center dir-rtl">
          <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mb-6 border border-rose-500/20 shadow-xl">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black mb-2">مشکلی در اجرای برنامه چیکجا رخ داده است</h1>
          <p className="text-slate-400 text-sm max-w-md mb-6 leading-relaxed">
            تیم فنی چیکجا از این مسئله مطلع شده است. لطفاً صفحه را بازنشانی کنید.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/30 active:scale-95 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>بارگذاری مجدد برنامه</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
