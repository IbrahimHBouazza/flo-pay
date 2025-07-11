import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SignIn as ClerkSignInForm } from '@clerk/nextjs';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { IconStar } from '@tabler/icons-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

export default function SignInViewPage({ stars }: { stars: number }) {
  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <Link
        href='/examples/authentication'
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute top-4 right-4 hidden md:top-8 md:right-8'
        )}
      >
        Login
      </Link>

      {/* Left side with branding */}
      <div className='relative hidden h-full flex-col bg-zinc-900 p-10 text-white lg:flex dark:border-r'>
        <div className='relative z-20 flex items-center text-lg font-medium'>
          {/* Custom Logo */}
          <div className='mr-3 flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-500/20 backdrop-blur-sm'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='h-6 w-6 text-cyan-400'
            >
              <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' />
            </svg>
          </div>
          <span className='text-2xl font-bold text-cyan-400'>Flopay</span>
        </div>

        <div className='relative z-20 flex flex-1 items-center justify-center'>
          <div className='space-y-6 text-center'>
            <div className='space-y-4'>
              <h1 className='text-4xl leading-tight font-bold'>
                <span className='text-white'>
                  Manage your clients all in one
                </span>
                <br />
                <span className='text-cyan-400'>place</span>
              </h1>
              <p className='text-xl leading-relaxed text-gray-300'>
                Experience a one stop solution where you can manage your clients
                in one place.
              </p>
            </div>

            <div className='flex items-center justify-center space-x-4 pt-4'>
              <div className='flex items-center space-x-2'>
                <div className='h-2 w-2 rounded-full bg-cyan-400'></div>
                <span className='text-sm text-gray-400'>
                  Bank-level security
                </span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='h-2 w-2 rounded-full bg-blue-400'></div>
                <span className='text-sm text-gray-400'>Instant transfers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side with sign-in form */}
      <div className='flex h-full items-center justify-center bg-zinc-900 p-4 lg:p-8'>
        <div className='flex w-full max-w-md flex-col items-center justify-center space-y-6'>
          {/* App branding for mobile */}
          <div className='mb-4 flex items-center space-x-3 lg:hidden'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='h-5 w-5 text-white'
              >
                <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' />
              </svg>
            </div>
            <span className='text-xl font-bold text-cyan-400'>FloPay</span>
          </div>

          <ClerkSignInForm
            initialValues={{
              emailAddress: 'your_mail+clerk_test@example.com'
            }}
          />

          <p className='px-8 text-center text-sm text-gray-400'>
            By clicking continue, you agree to our{' '}
            <Link
              href='/terms'
              className='underline underline-offset-4 hover:text-cyan-400'
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href='/privacy'
              className='underline underline-offset-4 hover:text-cyan-400'
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
